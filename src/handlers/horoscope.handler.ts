import { Injectable } from '@nestjs/common';
import {
  Command,
  Args,
  AutoContext,
  SmartMessage,
  EmbedBuilder,
  Nezon,
} from '@n0xgg04/nezon';

import {
  ZODIAC_SIGNS,
  ZODIAC_SIGNS_DATA,
  LUCKY_COLORS,
  LUCKY_NUMBERS,
  DIRECTIONS,
  LUCKY_HOURS,
} from '../data/horoscope.data';

interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dateRange: string;
}

@Injectable()
export class HoroscopeHandler {

  /**
   * Extract user information from message for personalized horoscope
   */
  private extractUserInfo(message: any, mentionIndex: number = -1) {
    const msgAny = message as any;
    
    // Check if we should use mentioned user or message sender
    let targetUser = null;
    if (mentionIndex >= 0 && msgAny.mentions && msgAny.mentions[mentionIndex]) {
      targetUser = msgAny.mentions[mentionIndex];
    }
    
    return {
      userId: targetUser?.user_id || targetUser?.id || message.senderId || 'unknown',
      displayName: targetUser?.display_name || targetUser?.username || msgAny.sender?.display_name || msgAny.sender?.username || 'Bạn',
      username: targetUser?.username || msgAny.sender?.username || 'user',
      avatar: targetUser?.avatar || msgAny.sender?.avatar || msgAny.sender?.clan_avatar || null,
      clanId: message.clanId || msgAny.clan_id || 'default',
      channelId: message.channelId || msgAny.channel_id || 'default',
    };
  }

  /**
   * Create enhanced seed for deterministic horoscope
   * Format: userId_date_clanId_channelId_signId
   */
  private createEnhancedSeed(userId: string, date: string, clanId: string, channelId: string, signId: string): string {
    return `${userId}_${date}_${clanId}_${channelId}_${signId}`;
  }

  // Seeded Random Helper
  private getSeededRandom(seedStr: string): () => number {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
        seed |= 0;
    }
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private matchSign(input: string): ZodiacSign | undefined {
    const normalized = input.toLowerCase().replace(/\s/g, '');
    return ZODIAC_SIGNS.find(s => {
      const sName = s.name.toLowerCase().replace(/\s/g, '');
      const sId = s.id;
      return sName.includes(normalized) || sId.includes(normalized);
    });
  }

  @Command({ name: 'tuvi', aliases: ['horoscope', 'cung'] })
  async onHoroscope(
    @Args() args: Nezon.Args,
    @AutoContext() [message]: Nezon.AutoContext,
  ) {
    const input = args.join(' ');
    if (!input) {
      const list = ZODIAC_SIGNS.map(s => `\`${s.name}\``).join(', ');
      await message.reply(SmartMessage.text(`ℹ️ Vui lòng nhập tên cung. Ví dụ: \`/tuvi bachduong\`\nDanh sách: ${list}`));
      return;
    }

    const sign = this.matchSign(input);
    if (!sign) {
      await message.reply(SmartMessage.text('🚫 Không tìm thấy cung hoàng đạo này. Hãy thử lại (ví dụ: Kim Ngưu, Sư Tử, Virgo...).'));
      return;
    }

    // Extract user info (context-aware)
    const userInfo = this.extractUserInfo(message);
    
    // Daily & User Logic
    const date = new Date();
    date.setHours(date.getHours() + 7);
    const dateString = date.toISOString().split('T')[0];
    
    // Enhanced seed with context (user + date + clan + channel + sign)
    const seed = this.createEnhancedSeed(
      userInfo.userId,
      dateString,
      userInfo.clanId,
      userInfo.channelId,
      sign.id
    );
    const rng = this.getSeededRandom(seed);

    // Get sign-specific data
    const signData = ZODIAC_SIGNS_DATA[sign.id];

    // Randomize specs (deterministic based on seed) with sign bonuses
    let loveScore = Math.floor(rng() * 5) + 1; // 1-5
    let careerScore = Math.floor(rng() * 5) + 1;
    let moneyScore = Math.floor(rng() * 5) + 1;
    
    // Apply sign-specific bonuses
    loveScore = Math.max(1, Math.min(5, loveScore + signData.loveBonus));
    careerScore = Math.max(1, Math.min(5, careerScore + signData.careerBonus));
    moneyScore = Math.max(1, Math.min(5, moneyScore + signData.moneyBonus));
    
    const energyLevel = Math.floor(rng() * 41) + 60; // 60-100% (Make it positive)
    
    const luckyColor = LUCKY_COLORS[Math.floor(rng() * LUCKY_COLORS.length)];
    const luckyNumber = LUCKY_NUMBERS[Math.floor(rng() * LUCKY_NUMBERS.length)];
    const luckyHour = LUCKY_HOURS[Math.floor(rng() * LUCKY_HOURS.length)];
    const luckyDir = DIRECTIONS[Math.floor(rng() * DIRECTIONS.length)];
    
    // Get sign-specific advice instead of generic
    const advice = signData.advices[Math.floor(rng() * signData.advices.length)];
    
    // Get a compatible sign (not itself)
    const otherSigns = ZODIAC_SIGNS.filter(s => s.id !== sign.id);
    const compatibleSign = otherSigns[Math.floor(rng() * otherSigns.length)];

    const stars = (n: number) => '⭐'.repeat(n) + '☆'.repeat(5 - n);
    const avgScore = (loveScore + careerScore + moneyScore) / 3;
    const color = avgScore >= 4 ? '#F1C40F' : (avgScore >= 3 ? '#3498DB' : '#95A5A6');

    const embed = new EmbedBuilder()
      .setTitle(`${sign.symbol} Tử Vi ${sign.name} (${sign.dateRange})`)
      .setDescription(
        `**Dự báo cá nhân ngày ${dateString}**\n` +
        `*Chào ${userInfo.displayName}, đây là thông điệp riêng dành cho ngày hôm nay của bạn.*\n\n` +
        `**Nguyên tố:** ${signData.element} | **Điểm mạnh:** ${signData.strengths.slice(0, 2).join(', ')}`
      )
      .addField('💘 Tình cảm', stars(loveScore), true)
      .addField('💼 Sự nghiệp', stars(careerScore), true)
      .addField('💰 Tài lộc', stars(moneyScore), true)
      .addField('⚡ Năng lượng', `**${energyLevel}%**`, true)
      .addField('🤝 Cung hợp hạp', `**${compatibleSign.symbol} ${compatibleSign.name}**`, true)
      .addField('🕒 Giờ hoàng đạo', `**${luckyHour}**`, true)
      .addField('🍀 May mắn', `Màu: **${luckyColor}** | Số: **${luckyNumber}** | Hướng: **${luckyDir}**`, false)
      .addField('💡 Lời khuyên', advice, false)
      .setColor(color)
      .setFooter(`Personalized for ${userInfo.displayName}`);
    
    // Add user avatar as thumbnail if available
    if (userInfo.avatar) {
      embed.setThumbnail(userInfo.avatar);
    }

    await message.reply(SmartMessage.text('').addEmbed(embed));
  }
}
