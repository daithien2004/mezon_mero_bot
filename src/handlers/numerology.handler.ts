import { Injectable } from '@nestjs/common';
import {
  Command,
  Args,
  AutoContext,
  SmartMessage,
  EmbedBuilder,
  Nezon,
} from '@n0xgg04/nezon';

import { NUMEROLOGY_DATA, getNumerologyData } from '../data/numerology.data';

@Injectable()
export class NumerologyHandler {
  
  /**
   * Extract user information from message
   */
  private extractUserInfo(message: any) {
    const msgAny = message as any;
    return {
      userId: message.senderId || 'unknown',
      displayName: msgAny.sender?.display_name || msgAny.sender?.username || 'Bạn',
      avatar: msgAny.sender?.avatar || msgAny.sender?.clan_avatar || null,
    };
  }
  
  private calculateLifePath(day: number, month: number, year: number): number {
    const reduce = (n: number): number => {
      let sum = n;
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
      }
      return sum;
    };

    const daySum = reduce(day);
    const monthSum = reduce(month);
    const yearSum = reduce(year);

    let totalSum = daySum + monthSum + yearSum;
    
    while (totalSum > 9 && totalSum !== 11 && totalSum !== 22 && totalSum !== 33) {
      totalSum = totalSum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }

    return totalSum;
  }

  @Command({ name: 'thanso', aliases: ['numerology'] })
  async onNumerology(
    @Args() args: Nezon.Args,
    @AutoContext() [message]: Nezon.AutoContext,
  ) {
    const input = args[0];
    if (!input) {
      await message.reply(SmartMessage.text('ℹ️ Vui lòng nhập ngày sinh. Ví dụ: `/thanso 15/05/2000`'));
      return;
    }

    const parts = input.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (!parts) {
      await message.reply(SmartMessage.text('🚫 Định dạng ngày sai. Vui lòng dùng `DD/MM/YYYY`. Ví dụ: `15/05/2000`'));
      return;
    }

    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10);
    const year = parseInt(parts[3], 10);

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      await message.reply(SmartMessage.text('🚫 Ngày tháng không hợp lệ.'));
      return;
    }

    const lifePathNumber = this.calculateLifePath(day, month, year);
    const meaning = getNumerologyData(lifePathNumber);
    
    if (!meaning) {
      await message.reply(SmartMessage.text('⚠️ Không tìm thấy thông tin cho con số này.'));
      return;
    }

    // Extract user
    const userInfo = this.extractUserInfo(message);
    
    // Get a random advice
    const randomAdvice = meaning.advices[Math.floor(Math.random() * meaning.advices.length)];

    const embed = new EmbedBuilder()
      .setTitle(`🔮 Thần Số Học: ${meaning.title}`)
      .setDescription(
        `**Ngày sinh:** ${day}/${month}/${year}\n` +
        `**Con số chủ đạo:** ${lifePathNumber}${meaning.element ? ` (🌟 ${meaning.element})` : ''}\n\n` +
        meaning.description
      )
      .addField('💪 Điểm mạnh', meaning.strengths.join(', '), false)
      .addField('⚠️ Điểm yếu', meaning.weaknesses.join(', '), false)
      .addField('💼 Sự nghiệp phù hợp', meaning.career.slice(0, 3).join(', '), true)
      .addField('💘 Tình yêu', meaning.love, true)
      .addField('🤝 Tương thích', `Số ${meaning.compatibility.join(', ')}`, true)
      .addField('💡 Lời khuyên', randomAdvice, false)
      .setColor(meaning.color)
      .setFooter(`Personalized for ${userInfo.displayName} | Pythagoras System`);
    
    // Add user avatar if available
    if (userInfo.avatar) {
      embed.setThumbnail(userInfo.avatar);
    }

    await message.reply(SmartMessage.text('').addEmbed(embed));
  }
}
