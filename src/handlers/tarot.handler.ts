import { Injectable, Logger } from '@nestjs/common';
import {
  Command,
  Args,
  AutoContext,
  SmartMessage,
  EmbedBuilder,
  Nezon,
} from '@n0xgg04/nezon';

import { TarotApiService } from '../services/tarot-api.service';
import { VIETNAMESE_MEANINGS } from '../data/vietnamese-meanings';
import { MAJOR_META, SUIT_META } from '../data/tarot.data';

@Injectable()
export class TarotHandler {
  private readonly logger = new Logger(TarotHandler.name);

  constructor(private readonly tarotApiService: TarotApiService) {}

  // --- Helper Methods ---

  /**
   * Extract user information from message for personalized tarot readings
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
   * Create enhanced seed for deterministic card selection
   * Format: userId_date_clanId_channelId
   */
  private createEnhancedSeed(userId: string, date: string, clanId: string, channelId: string): string {
    return `${userId}_${date}_${clanId}_${channelId}`;
  }

  private createRNG(seedStr: string) {
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

  private getCardMetadata(cardId: string, suit: string) {
    let element = '';
    let astrology = '';
    let yesNo = 'Có thể';

    if (suit === 'major') {
      const meta = MAJOR_META[cardId];
      if (meta) {
        element = meta.element;
        astrology = meta.astrology || '';
        yesNo = meta.yesNo;
      }
    } else if (suit) {
        // Minor Arcana
        const suitData = SUIT_META[suit];
        element = suitData ? suitData.element : '';
        
        // Infer Yes/No from card value
        const vietnamese = VIETNAMESE_MEANINGS[cardId];
        if (vietnamese) {
          // Simple heuristic based on keywords
          const keywords = vietnamese.keywords.join(' ').toLowerCase();
          if (keywords.includes('chiến thắng') || keywords.includes('thành công') || keywords.includes('hạnh phúc')) {
            yesNo = 'Có';
          } else if (keywords.includes('đau khổ') || keywords.includes('thất bại') || keywords.includes('khó khăn')) {
            yesNo = 'Không';
          }
        }
        
        // Specific overrides for bad cards
        if (cardId === 'sw03' || cardId === 'sw09' || cardId === 'sw10' || cardId === 'wa10' || cardId === 'pe05') {
            yesNo = 'Không';
        }
    }

    return { element, astrology, yesNo };
  }

  private createCardEmbed(
    apiCard: any,
    isReversed: boolean, 
    titlePrefix = '', 
    showExtra = false,
    userAvatar: string | null = null
  ): EmbedBuilder {
    const cardId = apiCard.name_short;
    const vietnamese = VIETNAMESE_MEANINGS[cardId];
    
    if (!vietnamese) {
      this.logger.warn(`No Vietnamese translation for card: ${cardId}`);
      // Fallback to English
      return this.createFallbackEmbed(apiCard, isReversed, titlePrefix);
    }

    const status = isReversed ? '(Ngược)' : '(Thuận)';
    const color = isReversed ? '#E74C3C' : '#2ECC71';
    const imageUrl = `https://www.sacred-texts.com/tarot/pkt/img/${cardId}.jpg`;
    
    // Get Metadata
    const { element, astrology, yesNo } = this.getCardMetadata(cardId, apiCard.type);

    const embed = new EmbedBuilder()
      .setTitle(`${titlePrefix} ${vietnamese.nameVI} - ${apiCard.name} ${status}`)
      .setImage(imageUrl)
      .setColor(color)
      .setDescription(
        `**Từ khóa:** ${vietnamese.keywords.join(', ')}\n\n` +
        `**Ý nghĩa ${status}:**\n${isReversed ? vietnamese.meaningRev : vietnamese.meaningUp}`
      );

    if (showExtra) {
        let extraInfo = `**Nguyên tố:** ${element}`;
        if (astrology) extraInfo += ` | **Tinh tú:** ${astrology}`;
        extraInfo += ` | **Yes/No:** ${yesNo}`;
        embed.setFooter(extraInfo);
    } else {
        embed.setFooter('Tarot Việt Hóa - Rider Waite (API)');
    }
    
    // Add user avatar as thumbnail if available
    if (userAvatar) {
      embed.setThumbnail(userAvatar);
    }
      
    return embed;
  }

  private createFallbackEmbed(apiCard: any, isReversed: boolean, titlePrefix: string): EmbedBuilder {
    const status = isReversed ? '(Reversed)' : '(Upright)';
    const color = isReversed ? '#E74C3C' : '#2ECC71';
    
    return new EmbedBuilder()
      .setTitle(`${titlePrefix} ${apiCard.name} ${status}`)
      .setDescription(isReversed ? apiCard.meaning_rev : apiCard.meaning_up)
      .setColor(color)
      .setFooter('Tarot API - English Fallback');
  }

  // --- Feature Handlers ---

  @Command({ name: 'tarot' })
  async onTarot(
    @Args() args: Nezon.Args,
    @AutoContext() [message]: Nezon.AutoContext,
  ) {
    const subCommand = args[0] ? args[0].toLowerCase() : '';

    // Route commands
    switch (subCommand) {
        case 'spread':
        case '3':
            await this.handleSpread(message, 'time');
            break;
        case 'love':
            await this.handleSpread(message, 'love');
            break;
        case 'career':
            await this.handleSpread(message, 'career');
            break;
        case 'ask':
            await this.handleAsk(message, args.slice(1).join(' '));
            break;
        case 'random':
            await this.handleRandomOne(message);
            break;
        case 'soul':
            await this.handleSoulCard(message, args.slice(1).join(' '));
            break;
        default:
             await this.handleDaily(message);
             break;
    }
  }

  // 1. Daily Draw (Default)
  private async handleDaily(message: any) {
    try {
      // Extract user info (handles mentions automatically)
      const msgAny = message as any;
      const mentionIndex = msgAny.mentions && msgAny.mentions.length > 0 ? 0 : -1;
      const userInfo = this.extractUserInfo(message, mentionIndex);
      
      const titlePrefix = mentionIndex >= 0 
        ? `Thông điệp cho ${userInfo.displayName}`
        : 'Thông điệp ngày';

      const date = new Date();
      date.setHours(date.getHours() + 7);
      const dateString = date.toISOString().split('T')[0];

      // Create enhanced seed with context (userId + date + clanId + channelId)
      const seedStr = this.createEnhancedSeed(
        userInfo.userId,
        dateString,
        userInfo.clanId,
        userInfo.channelId
      );
      
      // Get seeded random cards from API
      const cards = await this.tarotApiService.getRandomCards(1, seedStr);
      if (cards.length === 0) {
        await message.reply(SmartMessage.text('⚠️ Không thể lấy bài Tarot. Vui lòng thử lại sau.'));
        return;
      }

      const card = cards[0];
      const rng = this.createRNG(seedStr + '_reverse');
      const isReversed = rng() < 0.3;

      await message.reply(
        SmartMessage.text(`🔮 ${titlePrefix} hôm nay (${dateString})`)
          .addEmbed(this.createCardEmbed(card, isReversed, '', true, userInfo.avatar))
      );
    } catch (error) {
      this.logger.error('Error in handleDaily', error);
      await message.reply(SmartMessage.text('❌ Có lỗi xảy ra khi rút bài. Vui lòng thử lại.'));
    }
  }

  // 2. Random One
  private async handleRandomOne (message: any) {
    try {
      const userInfo = this.extractUserInfo(message);
      
      const cards = await this.tarotApiService.getRandomCards(1);
      if (cards.length === 0) {
        await message.reply(SmartMessage.text('⚠️ Không thể lấy bài Tarot. Vui lòng thử lại sau.'));
        return;
      }

      const card = cards[0];
      const isReversed = Math.random() < 0.3;

      await message.reply(
          SmartMessage.text(`🎲 **Lá bài của bạn:**`)
            .addEmbed(this.createCardEmbed(card, isReversed, '', true, userInfo.avatar))
        );
    } catch (error) {
      this.logger.error('Error in handleRandomOne', error);
      await message.reply(SmartMessage.text('❌ Có lỗi xảy ra khi rút bài. Vui lòng thử lại.'));
    }
  }

  // 3. Complex Spreads
  private async handleSpread(message: any, type: 'time' | 'love' | 'career' | 'choice') {
    try {
      const userInfo = this.extractUserInfo(message);
      
      // Create seed based on user + date + spread type
      const date = new Date();
      date.setHours(date.getHours() + 7);
      const dateString = date.toISOString().split('T')[0];
      
      const seedStr = this.createEnhancedSeed(
        userInfo.userId,
        dateString,
        userInfo.clanId,
        `${userInfo.channelId}_${type}`
      );
      
      // Get seeded cards (deterministic)
      const cards = await this.tarotApiService.getRandomCards(3, seedStr);
      if (cards.length < 3) {
        await message.reply(SmartMessage.text('⚠️ Không thể lấy đủ bài để trải. Vui lòng thử lại sau.'));
        return;
      }

      // Create RNG for reversed cards (deterministic)
      const rng = this.createRNG(seedStr + '_reverse');
      const spreadCards = cards.map(c => ({ card: c, isReversed: rng() < 0.3 }));

      let title = '';
      let labels: string[] = [];

      switch (type) {
          case 'time':
              title = 'Trải bài Thời Gian (Time Spread)';
              labels = ['Quá khứ / Nguyên nhân', 'Hiện tại / Hoàn cảnh', 'Tương lai / Kết quả'];
              break;
          case 'love':
              title = 'Trải bài Tình Yêu (Love Spread)';
              labels = ['Bạn trong mối quan hệ', 'Người ấy / Đối phương', 'Kết quả / Tương lai mối quan hệ'];
              break;
          case 'career':
              title = 'Trải bài Công Việc (Career Spread)';
              labels = ['Công việc hiện tại', 'Thách thức / Cơ hội', 'Kết quả dự kiến'];
              break;
      }

      const msg = SmartMessage.text(`✨ **${title}** ✨`);
      
      for (let i = 0; i < 3; i++) {
          const embed = this.createCardEmbed(spreadCards[i].card, spreadCards[i].isReversed, `**${i + 1}️⃣ ${labels[i]}:**`, true, userInfo.avatar);
          msg.addEmbed(embed);
      }

      await message.reply(msg);
    } catch (error) {
      this.logger.error('Error in handleSpread', error);
      await message.reply(SmartMessage.text('❌ Có lỗi xảy ra khi trải bài. Vui lòng thử lại.'));
    }
  }

  // 4. Ask Yes/No
  private async handleAsk(message: any, question: string) {
    if (!question) {
        await message.reply(SmartMessage.text('ℹ️ Bạn muốn hỏi gì? Ví dụ: `/tarot ask Crush có thích mình không?`'));
        return;
    }

    try {
      const userInfo = this.extractUserInfo(message);
      
      // Create seed based on user + date + question
      const date = new Date();
      date.setHours(date.getHours() + 7);
      const dateString = date.toISOString().split('T')[0];
      
      // Hash question to create unique but deterministic seed
      let questionHash = 0;
      for (let i = 0; i < question.length; i++) {
        questionHash = ((questionHash << 5) - questionHash) + question.charCodeAt(i);
        questionHash |= 0;
      }
      
      const seedStr = this.createEnhancedSeed(
        userInfo.userId,
        dateString,
        userInfo.clanId,
        `${userInfo.channelId}_ask_${questionHash}`
      );
      
      // Get seeded card (deterministic)
      const cards = await this.tarotApiService.getRandomCards(1, seedStr);
      if (cards.length === 0) {
        await message.reply(SmartMessage.text('⚠️ Không thể lấy bài Tarot. Vui lòng thử lại sau.'));
        return;
      }

      const card = cards[0];
      
      // Deterministic reversed check (40% chance)
      const rng = this.createRNG(seedStr + '_reverse');
      const isReversed = rng() < 0.4;
      
      const meta = this.getCardMetadata(card.name_short, card.type);
      let answer = meta.yesNo;
      
      // Invert answer if reversed
      if (isReversed) {
          if (answer === 'Có') answer = 'Không';
          else if (answer === 'Không') answer = 'Có';
      }

      const emoji = answer === 'Có' ? '✅' : (answer === 'Không' ? '❌' : '🤔');

      await message.reply(
          SmartMessage.text(`🗣️ **Hỏi:** ${question}\n👉 **Trả lời:** ${emoji} **${answer.toUpperCase()}**`)
            .addEmbed(this.createCardEmbed(card, isReversed, '', true, userInfo.avatar))
        );
    } catch (error) {
      this.logger.error('Error in handleAsk', error);
      await message.reply(SmartMessage.text('❌ Có lỗi xảy ra khi hỏi bài. Vui lòng thử lại.'));
    }
  }

  // 5. Soul Card
  private async handleSoulCard(message: any, dateInput: string) {
     if (!dateInput) {
        await message.reply(SmartMessage.text('ℹ️ Nhập ngày sinh để tìm Lá Bài Linh Hồn. Ví dụ: `/tarot soul 15/05/2000`'));
        return;
     }

     const parts = dateInput.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
     if (!parts) {
        await message.reply(SmartMessage.text('🚫 Sai định dạng. Dùng DD/MM/YYYY.'));
        return;
     }
     
     const d = parseInt(parts[1], 10);
     const m = parseInt(parts[2], 10);
     const y = parseInt(parts[3], 10);

     try {
       const userInfo = this.extractUserInfo(message);
       
       let sum = d + m + y;
       
       const reduce = (n: number) => n.toString().split('').reduce((a,b) => a + parseInt(b), 0);
       
       let soulNumber = reduce(sum);
       while (soulNumber > 21) {
           soulNumber = reduce(soulNumber);
       }

       let rootNumber = soulNumber;
       while (rootNumber > 9) {
          rootNumber = reduce(rootNumber);
       }

       const displayNum = soulNumber === rootNumber ? `${soulNumber}` : `${soulNumber} / ${rootNumber}`;
       
       const id = soulNumber < 10 ? `ar0${soulNumber}` : `ar${soulNumber}`;
       
       // Get all cards and find the soul card
       const allCards = await this.tarotApiService.getAllCards();
       const card = allCards.find(c => c.name_short === id);

       if (!card) {
           await message.reply(SmartMessage.text('⚠️ Không tìm thấy lá bài phù hợp (Lỗi tính toán).'));
           return;
       }

       await message.reply(
           SmartMessage.text(`🧩 **Lá Bài Linh Hồn của bạn (${dateInput}):**\nCon số Tarot: **${displayNum}**`)
           .addEmbed(this.createCardEmbed(card, false, 'Soul Card:', true, userInfo.avatar))
       );
     } catch (error) {
       this.logger.error('Error in handleSoulCard', error);
       await message.reply(SmartMessage.text('❌ Có lỗi xảy ra. Vui lòng thử lại.'));
     }
  }
}
