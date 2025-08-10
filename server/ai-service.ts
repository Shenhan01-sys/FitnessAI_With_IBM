import type { UserProfile } from "@shared/schema";

interface AIResponse {
  generated_text: string;
}

export class AIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.IBM_GRANITE_API_KEY || '';
    this.apiUrl = process.env.IBM_GRANITE_API_URL || '';
    
    if (!this.apiKey || !this.apiUrl) {
      console.warn('IBM Granite API credentials not configured');
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    if (!this.apiKey || !this.apiUrl) {
      return "Maaf, layanan AI sedang tidak tersedia. Silakan coba lagi nanti.";
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          input: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_k: 50,
            top_p: 0.9,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.results?.[0]?.generated_text || data.generated_text || "Maaf, tidak dapat menghasilkan respons.";
    } catch (error) {
      console.error('AI API Error:', error);
      return "Maaf, terjadi kesalahan dalam mengakses layanan AI.";
    }
  }

  async generateWorkoutPlan(profile: UserProfile): Promise<string> {
    const goalText = {
      cutting: 'menurunkan lemak tubuh',
      bulking: 'menambah massa otot',
      recomposition: 'rekomposisi tubuh (mengurangi lemak dan menambah otot)'
    };

    const prompt = `
Sebagai ahli fitness profesional, buatkan program latihan mingguan untuk:
- Berat badan: ${profile.weight} kg
- Persentase lemak tubuh: ${profile.bodyFat}%
- Persentase massa otot: ${profile.muscleMass}%
- Usia: ${profile.age} tahun
- Tujuan: ${goalText[profile.goal as keyof typeof goalText] || 'umum'}

Berikan jadwal latihan 7 hari dengan format yang detail:
SENIN: [Nama Latihan] - [3-4 latihan spesifik dengan set x rep]
SELASA: [Nama Latihan] - [3-4 latihan spesifik dengan set x rep]
RABU: [Istirahat Aktif/Recovery] - [Aktivitas ringan]
KAMIS: [Nama Latihan] - [3-4 latihan spesifik dengan set x rep]
JUMAT: [Nama Latihan] - [3-4 latihan spesifik dengan set x rep]
SABTU: [Cardio/HIIT] - [Jenis dan durasi]
MINGGU: [Istirahat Total] - [Recovery tips]

Sesuaikan intensitas dengan kondisi fisik dan tujuan yang ingin dicapai.
`;

    return await this.makeRequest(prompt);
  }

  async generateWeeklySchedule(profile: UserProfile): Promise<Array<{name: string, workout: string}>> {
    const goalText = {
      cutting: 'menurunkan lemak tubuh dengan cardio lebih intensif',
      bulking: 'menambah massa otot dengan fokus strength training',
      recomposition: 'kombinasi strength training dan cardio moderat'
    };

    const prompt = `
Sebagai ahli fitness, buatkan jadwal mingguan singkat untuk tujuan ${goalText[profile.goal as keyof typeof goalText] || 'fitness umum'}.

Berikan dalam format:
Senin: [Nama latihan singkat]
Selasa: [Nama latihan singkat]
Rabu: [Nama latihan singkat]
Kamis: [Nama latihan singkat]
Jumat: [Nama latihan singkat]
Sabtu: [Nama latihan singkat]
Minggu: [Nama latihan singkat]

Contoh: "Latihan Dada & Trisep" atau "Cardio HIIT" atau "Istirahat Aktif"
`;

    try {
      const response = await this.makeRequest(prompt);
      
      // Parse the response into array format
      const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
      const schedule = days.map((day, index) => {
        const dayPattern = new RegExp(`${day}:\\s*(.+)`, 'i');
        const match = response.match(dayPattern);
        
        // Fallback schedule based on goal if AI response can't be parsed
        const fallbackSchedule = {
          cutting: [
            'Latihan Upper Body & Cardio',
            'Latihan Lower Body',
            'Cardio HIIT',
            'Latihan Push (Dada, Bahu, Trisep)',
            'Latihan Pull (Punggung, Bisep)',
            'Cardio Steady State',
            'Istirahat Total'
          ],
          bulking: [
            'Latihan Dada & Trisep',
            'Latihan Punggung & Bisep',
            'Istirahat Aktif',
            'Latihan Kaki & Glutes',
            'Latihan Bahu & Core',
            'Latihan Full Body',
            'Istirahat Total'
          ],
          recomposition: [
            'Latihan Upper Body',
            'Latihan Lower Body',
            'Cardio & Core',
            'Latihan Push',
            'Latihan Pull',
            'Functional Training',
            'Istirahat Total'
          ]
        };
        
        return {
          name: day,
          workout: match ? match[1].trim() : fallbackSchedule[profile.goal as keyof typeof fallbackSchedule]?.[index] || 'Latihan Umum'
        };
      });
      
      return schedule;
    } catch (error) {
      console.error('Error generating weekly schedule:', error);
      // Return default schedule
      return [
        { name: 'Senin', workout: 'Latihan Dada & Trisep' },
        { name: 'Selasa', workout: 'Latihan Punggung & Bisep' },
        { name: 'Rabu', workout: 'Istirahat Aktif' },
        { name: 'Kamis', workout: 'Latihan Kaki & Glutes' },
        { name: 'Jumat', workout: 'Latihan Bahu & Core' },
        { name: 'Sabtu', workout: 'Cardio & Stretching' },
        { name: 'Minggu', workout: 'Istirahat Total' }
      ];
    }
  }

  async generateNutritionPlan(profile: UserProfile): Promise<string> {
    const goalText = {
      cutting: 'defisit kalori untuk menurunkan lemak',
      bulking: 'surplus kalori untuk menambah massa otot',
      recomposition: 'maintenance kalori dengan fokus protein tinggi'
    };

    const prompt = `
Sebagai ahli nutrisi olahraga, buatkan panduan pola makan untuk:
- Berat badan: ${profile.weight} kg
- Persentase lemak tubuh: ${profile.bodyFat}%
- Persentase massa otot: ${profile.muscleMass}%
- Usia: ${profile.age} tahun
- Tujuan: ${goalText[profile.goal as keyof typeof goalText] || 'umum'}

Berikan rekomendasi:
1. Target kalori harian
2. Pembagian makronutrien (protein, karbohidrat, lemak)
3. Contoh makanan yang direkomendasikan
4. Tips pola makan

Sesuaikan dengan kondisi tubuh dan tujuan yang ingin dicapai.
`;

    return await this.makeRequest(prompt);
  }

  async generateSleepPlan(profile: UserProfile): Promise<string> {
    const prompt = `
Sebagai ahli sleep health dan recovery, buatkan panduan pola tidur untuk:
- Usia: ${profile.age} tahun
- Aktivitas: Program fitness intensif
- Tujuan: Optimalisasi recovery dan performa

Berikan rekomendasi:
1. Durasi tidur ideal
2. Jadwal tidur yang optimal
3. Tips untuk meningkatkan kualitas tidur
4. Hubungan tidur dengan recovery otot

Berikan panduan praktis dan mudah diterapkan.
`;

    return await this.makeRequest(prompt);
  }

  async generateChatResponse(userMessage: string, profile?: UserProfile): Promise<string> {
    const contextInfo = profile ? `
Context pengguna:
- Berat: ${profile.weight}kg, Lemak: ${profile.bodyFat}%, Otot: ${profile.muscleMass}%
- Usia: ${profile.age} tahun, Tujuan: ${profile.goal}
` : '';

    const prompt = `
Anda adalah FitAI, asisten fitness profesional yang ramah dan berpengetahuan luas.
${contextInfo}

Pertanyaan pengguna: "${userMessage}"

Berikan jawaban yang:
- Relevan dengan konteks fitness/kesehatan
- Praktis dan mudah dipahami
- Menggunakan bahasa Indonesia yang natural
- Singkat tapi informatif (maksimal 100 kata)
- Mendorong pola hidup sehat

Jika pertanyaan di luar topik fitness, arahkan kembali ke topik kesehatan dengan sopan.
`;

    return await this.makeRequest(prompt);
  }
}

export const aiService = new AIService();