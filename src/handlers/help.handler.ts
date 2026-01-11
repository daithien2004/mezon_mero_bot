import { Injectable } from '@nestjs/common';
import {
  Command,
  AutoContext,
  SmartMessage,
  EmbedBuilder,
  Nezon,
} from '@n0xgg04/nezon';

@Injectable()
export class HelpHandler {
  @Command({ name: 'help', aliases: ['huongdan', 'h'] })
  async onHelp(@AutoContext() [message]: Nezon.AutoContext) {
    const helpText = `
🔮 **TAROT** (Cá nhân hóa theo context)
\`*tarot\` → Bói bài ngày (theo user + ngày + clan/channel)
\`*tarot random\` → Rút lá ngẫu nhiên
\`*tarot spread\` → Trải 3 lá Thời Gian (Quá khứ - Hiện tại - Tương lai)
\`*tarot love\` → Trải bài tình yêu
\`*tarot career\` → Trải bài sự nghiệp
\`*tarot ask <câu hỏi>\` → Hỏi Yes/No (kết quả nhất quán cho cùng câu hỏi)
\`*tarot soul DD/MM/YYYY\` → Lá Bài Linh Hồn

🔢 **THẦN SỐ HỌC** (60+ lời khuyên cá nhân hóa)
\`*thanso DD/MM/YYYY\` → Tính con số chủ đạo, sự nghiệp, tình yêu, tương thích

⭐ **TỬ VI** (144+ lời khuyên riêng cho từng cung)
\`*tuvi <cung>\` → Xem tử vi ngày \`*tuvi Bạch Dương\`
Mỗi cung có tính cách, điểm mạnh/yếu riêng + lời khuyên chuyên biệt

📱 **TIỆN ÍCH**
\`*qr <nội dung>\` → Tạo mã QR
\`*ping\` → Kiểm tra bot

❓ **TRỢ GIÚP**
\`*help\` → Xem danh sách lệnh

✨ **Tính năng nổi bật:**
• Avatar cá nhân trong mọi kết quả
• Kết quả nhất quán (cùng điều kiện = cùng kết quả)
• Lời khuyên chuyên biệt cho từng cung/số
    `.trim();

    const embed = new EmbedBuilder()
      .setTitle('📚 Hướng Dẫn Sử Dụng Bot')
      .setDescription(helpText)
      .setColor('#9B59B6')
      .setFooter('Prefix: * hoặc /');

    await message.reply(SmartMessage.text('').addEmbed(embed));
  }
}
