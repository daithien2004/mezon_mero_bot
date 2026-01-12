# 🔮 Mezon Bot - Tarot, Horoscope & Numerology Bot

Bot Mezon hỗ trợ bói bài Tarot, xem tử vi và thần số học với khả năng cá nhân hóa cao.

## 📋 Tổng Quan

Bot này cung cấp các tính năng:
- **Tarot**: 78 lá bài với nghĩa tiếng Việt đầy đủ
- **Tử Vi**: 12 cung hoàng đạo với 144+ lời khuyên cá nhân hóa
- **Thần Số Học**: 12 con số chủ đạo với phân tích career, love, compatibility
- **Tiện Ích**: QR code generator, ping test

**Prefix:** `*` hoặc `/`

---

## 🎯 Danh Sách Lệnh

### 🔮 TAROT (Bói Bài Tarot)

#### 1. `*tarot` - Bói Bài Ngày
**Mô tả:** Rút 1 lá bài dựa trên thông tin người dùng và ngày hiện tại.

**Tính toán:**
- **Seed:** `userId_date_clanId_channelId`
- **Deterministic:** ✅ (Cùng user, cùng ngày, cùng clan/channel → cùng lá bài)
- **Xác suất ngược:** 30% (seed-based RNG)

**Dữ liệu:**
- **API:** `tarotapi.dev` - 78 lá bài Rider-Waite
- **Nghĩa:** `src/data/vietnamese-meanings.ts` - Nghĩa tiếng Việt
- **Metadata:** `src/data/tarot.data.ts` - Element, astrology, Yes/No

**Output:**
- Tên lá bài (tiếng Việt + tiếng Anh)
- Trạng thái (Thuận/Ngược)
- Hình ảnh lá bài
- Từ khóa
- Ý nghĩa chi tiết
- Nguyên tố, tinh tú, Yes/No (nếu có)
- Avatar người dùng

---

#### 2. `*tarot random` - Rút Lá Ngẫu Nhiên
**Mô tả:** Rút 1 lá bài hoàn toàn ngẫu nhiên.

**Tính toán:**
- **Seed:** Không có (Math.random())
- **Deterministic:** ❌ (Mỗi lần khác nhau)
- **Xác suất ngược:** 30%

**Dữ liệu:** Giống `*tarot`

---

#### 3. `*tarot spread` - Trải Bài Thời Gian (3 lá)
**Mô tả:** Rút 3 lá bài cho quá khứ, hiện tại, tương lai.

**Tính toán:**
- **Seed:** `userId_date_clanId_channelId_time`
- **Deterministic:** ✅
- **Xác suất ngược:** 30% cho mỗi lá

**Dữ liệu:** Giống `*tarot`

**Output:**
- **Lá 1:** Quá khứ / Nguyên nhân
- **Lá 2:** Hiện tại / Hoàn cảnh
- **Lá 3:** Tương lai / Kết quả

---

#### 4. `*tarot love` - Trải Bài Tình Yêu (3 lá)
**Mô tả:** Rút 3 lá bài phân tích tình yêu.

**Tính toán:**
- **Seed:** `userId_date_clanId_channelId_love`
- **Deterministic:** ✅

**Output:**
- **Lá 1:** Bạn trong mối quan hệ
- **Lá 2:** Người ấy / Đối phương
- **Lá 3:** Kết quả / Tương lai mối quan hệ

---

#### 5. `*tarot career` - Trải Bài Sự Nghiệp (3 lá)
**Mô tả:** Rút 3 lá bài phân tích công việc.

**Tính toán:**
- **Seed:** `userId_date_clanId_channelId_career`
- **Deterministic:** ✅

**Output:**
- **Lá 1:** Công việc hiện tại
- **Lá 2:** Thách thức / Cơ hội
- **Lá 3:** Kết quả dự kiến

---

#### 6. `*tarot ask <câu hỏi>` - Hỏi Yes/No
**Mô tả:** Rút 1 lá bài để trả lời câu hỏi Yes/No.

**Tính toán:**
- **Seed:** `userId_date_clanId_channelId_ask_questionHash`
- **Question Hash:** Hash của câu hỏi để đảm bảo cùng câu hỏi = cùng đáp án
- **Deterministic:** ✅ (Cùng user, cùng ngày, cùng câu hỏi → cùng đáp án)
- **Xác suất ngược:** 40%

**Logic:**
1. Lấy Yes/No từ metadata lá bài
2. Nếu lá bị ngược → đảo đáp án (Có ↔ Không)

**Output:**
- Câu hỏi
- Đáp án: ✅ Có / ❌ Không / 🤔 Có thể
- Lá bài giải thích

---

#### 7. `*tarot soul DD/MM/YYYY` - Lá Bài Linh Hồn
**Mô tả:** Tính lá bài linh hồn dựa trên ngày sinh.

**Tính toán:**
- **Thuật toán:** Tính theo số học Tarot từ ngày sinh
- **Deterministic:** ✅ (Cùng ngày sinh = cùng lá bài)
- **Ngược:** Không có (luôn thuận)

**Ví dụ:**
```
15/05/2000 → 1+5+5+2+0+0+0 = 13 → Major Arcana #13 (Death)
```

---

### ⭐ TỬ VI (Horoscope)

#### `*tuvi <cung>` - Xem Tử Vi Ngày
**Mô tả:** Xem tử vi hàng ngày cho 12 cung hoàng đạo.

**Aliases:** `*horoscope`, `*cung`

**Danh sách cung:**
- Bạch Dương (Aries) - 21/3 - 19/4
- Kim Ngưu (Taurus) - 20/4 - 20/5
- Song Tử (Gemini) - 21/5 - 20/6
- Cự Giải (Cancer) - 21/6 - 22/7
- Sư Tử (Leo) - 23/7 - 22/8
- Xử Nữ (Virgo) - 23/8 - 22/9
- Thiên Bình (Libra) - 23/9 - 22/10
- Thiên Yết (Scorpio) - 23/10 - 21/11
- Nhân Mã (Sagittarius) - 22/11 - 21/12
- Ma Kết (Capricorn) - 22/12 - 19/1
- Bảo Bình (Aquarius) - 20/1 - 18/2
- Song Ngư (Pisces) - 19/2 - 20/3

**Tính toán:**
- **Seed:** `userId_date_clanId_channelId_signId`
- **Deterministic:** ✅ (Cùng user, cùng ngày, cùng cung → cùng kết quả)

**Dữ liệu:**
- **Source:** `src/data/horoscope.data.ts`
- **Content:** 144+ lời khuyên (12 lời khuyên/cung)
- **Metadata:** Element, điểm mạnh/yếu, bonus điểm

**Logic:**
1. Random base score (1-5) cho Love/Career/Money
2. Áp dụng **Sign Bonus**:
   - Leo, Aries: +1 Career
   - Libra, Pisces, Cancer: +1 Love
   - Taurus, Capricorn: +1 Money
3. Random từ: màu may mắn, số, hướng, giờ hoàng đạo
4. Chọn **lời khuyên riêng** cho cung đó

**Output:**
- Tên cung + ngày tháng
- Nguyên tố + điểm mạnh (2 điểm đầu)
- ⭐ Tình cảm (1-5 sao)
- 💼 Sự nghiệp (1-5 sao)
- 💰 Tài lộc (1-5 sao)
- ⚡ Năng lượng (60-100%)
- 🤝 Cung hợp hạp
- 🕒 Giờ hoàng đạo
- 🍀 Màu/số/hướng may mắn
- 💡 Lời khuyên (chuyên biệt cho cung)
- Avatar người dùng

---

### 🔢 THẦN SỐ HỌC (Numerology)

#### `*thanso DD/MM/YYYY` - Tính Con Số Chủ Đạo
**Mô tả:** Tính life path number và phân tích theo thần số học Pythagoras.

**Aliases:** `*numerology`

**Tính toán:**
- **Thuật toán:** Pythagoras Numerology
- **Cách tính:**
  ```
  Ví dụ: 15/05/2000
  
  Step 1: Rút gọn từng phần
  - Ngày: 15 → 1+5 = 6
  - Tháng: 05 → 0+5 = 5
  - Năm: 2000 → 2+0+0+0 = 2
  
  Step 2: Cộng lại
  - 6 + 5 + 2 = 13 → 1+3 = 4
  
  → Life Path Number = 4
  ```

- **Master Numbers:** 11, 22, 33 (không rút gọn thêm)

**Dữ liệu:**
- **Source:** `src/data/numerology.data.ts`
- **Content:** 60+ lời khuyên (5 lời khuyên/số)
- **Metadata:** Career paths, love insights, compatibility

**12 Con Số:**
- **2:** Người Hòa Giải
- **3:** Người Truyền Cảm Hứng
- **4:** Người Xây Dựng
- **5:** Người Tự Do
- **6:** Người Chăm Sóc
- **7:** Người Tri Thức
- **8:** Người Điều Hành
- **9:** Người Nhân Đạo
- **10:** Người Tiên Phong
- **11:** Người Khai Sáng (Master)
- **22:** Kiến Trúc Sư Đại Tài (Master)
- **33:** Người Chữa Lành Vĩ Đại (Master)

**Output:**
- Ngày sinh
- Con số chủ đạo + Element (nếu có)
- Mô tả chi tiết
- 💪 Điểm mạnh (danh sách)
- ⚠️ Điểm yếu (danh sách)
- 💼 Sự nghiệp phù hợp (top 3)
- 💘 Tình yêu (insights)
- 🤝 Tương thích (danh sách số)
- 💡 Lời khuyên (random 1/5)
- Màu sắc riêng cho từng số
- Avatar người dùng

---

### 📱 TIỆN ÍCH

#### `*qr <nội dung>` - Tạo Mã QR
**Aliases:** `*qrcode`

**Tính toán:** Sử dụng API QR code generator

---

#### `*ping` - Kiểm Tra Bot
**Aliases:** `*pong`

**Output:** Thời gian phản hồi của bot

---

## 🏗️ Cấu Trúc Dữ Liệu

```
src/
├── data/
│   ├── tarot.data.ts              # Metadata cho 78 lá tarot
│   │   ├── MAJOR_META             # Element, astrology, Yes/No cho Major Arcana
│   │   └── SUIT_META              # Element cho 4 suit
│   │
│   ├── vietnamese-meanings.ts     # Nghĩa tiếng Việt cho 78 lá bài
│   │   └── VIETNAMESE_MEANINGS    # nameVI, keywords, meaningUp, meaningRev
│   │
│   ├── horoscope.data.ts          # Dữ liệu 12 cung hoàng đạo
│   │   └── ZODIAC_SIGNS_DATA      # 144+ advices, traits, bonuses
│   │
│   └── numerology.data.ts         # Dữ liệu 12 life path numbers
│       └── NUMEROLOGY_DATA        # 60+ advices, career, love, compatibility
│
└── handlers/
    ├── tarot.handler.ts           # Xử lý lệnh tarot
    ├── horoscope.handler.ts       # Xử lý lệnh tử vi
    ├── numerology.handler.ts      # Xử lý lệnh thần số
    ├── utility.handler.ts         # QR code
    ├── ping.handler.ts            # Ping
    └── help.handler.ts            # Help command
```

---

## ✨ Tính Năng Nổi Bật

### 1. Context-Aware Seeding
Kết quả được tính toán dựa trên:
- **User ID**: Mỗi người khác nhau
- **Date**: Mỗi ngày khác nhau
- **Clan ID**: Mỗi clan khác nhau
- **Channel ID**: Mỗi kênh khác nhau

→ **Cùng người, cùng ngày, cùng nơi = cùng kết quả**

### 2. Deterministic Random
Sử dụng **Seeded RNG (xorshift algorithm)**:
- Cùng seed → cùng sequence số "random"
- Đảm bảo tính nhất quán
- Vẫn có vẻ ngẫu nhiên với user

### 3. Personalization
- **Avatar**: Hiện avatar người dùng trong mọi kết quả
- **Display Name**: Dùng tên hiển thị thay vì username
- **Specialized Content**: 200+ lời khuyên chuyên biệt

### 4. Rich Data
- **Tarot**: 78 lá bài với nghĩa đầy đủ tiếng Việt
- **Horoscope**: 144+ lời khuyên riêng cho từng cung
- **Numerology**: 60+ lời khuyên + career/love/compatibility

---

## 🎨 Data Sources

| Feature | Primary Source | Secondary Source | Total Content |
|---------|---------------|------------------|---------------|
| **Tarot Cards** | tarotapi.dev API | vietnamese-meanings.ts | 78 cards |
| **Tarot Metadata** | tarot.data.ts | - | Element, Astrology, Yes/No |
| **Horoscope** | horoscope.data.ts | - | 144+ advices, 12 signs |
| **Numerology** | numerology.data.ts | - | 60+ advices, 12 numbers |

---

## 🧪 Testing

### Tarot
```bash
*tarot                              # Daily reading
*tarot @mention                     # For mentioned user
*tarot random                       # Random card
*tarot spread                       # 3-card time spread
*tarot love                         # Love reading
*tarot career                       # Career reading
*tarot ask Crush có thích mình không?  # Yes/No question
*tarot soul 15/05/2000              # Soul card
```

### Horoscope
```bash
*tuvi bachduong                     # Aries
*tuvi leo                           # Leo (career bonus)
*tuvi song ngu                      # Pisces (love bonus)
```

### Numerology
```bash
*thanso 15/05/2000                  # Life path 4
*thanso 11/09/1990                  # Master number 11
```

---

## 📝 Notes

### Deterministic Commands
Những lệnh sau cho **kết quả giống nhau** với cùng điều kiện:
- `*tarot` (daily)
- `*tarot spread/love/career`
- `*tarot ask <câu hỏi>`
- `*tarot soul <ngày sinh>`
- `*tuvi <cung>`
- `*thanso <ngày sinh>`

### Random Commands
Lệnh cho kết quả **khác nhau** mỗi lần:
- `*tarot random`

### Advice Selection
- **Horoscope**: Random từ 12 advices của cung
- **Numerology**: Random từ 5 advices của số

---

## 🔧 Technical Details

### Seed Format
```typescript
// Tarot Daily
seed = `${userId}_${dateString}_${clanId}_${channelId}`

// Tarot Ask
seed = `${userId}_${dateString}_${clanId}_${channelId}_ask_${questionHash}`

// Horoscope
seed = `${userId}_${dateString}_${clanId}_${channelId}_${signId}`
```

### RNG Algorithm
```typescript
// Seeded xorshift RNG
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
```
