/**
 * Enhanced Numerology Data
 * Comprehensive meanings for Life Path Numbers
 */

export interface NumerologyNumberData {
  number: number;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  career: string[];
  love: string;
  compatibility: number[];
  advices: string[];
  color: string;
  element?: string;
}

export const NUMEROLOGY_DATA: Record<number, NumerologyNumberData> = {
  2: {
    number: 2,
    title: 'Người Hòa Giải',
    description: 'Bạn là người nhạy cảm, trực giác tốt và luôn mong muốn hòa bình. Bạn sống tình cảm và thích hợp tác. Số 2 đại diện cho sự cân bằng, hợp tác và nhạy cảm.',
    strengths: ['Lắng nghe tốt', 'Thấu hiểu', 'Ngoại giao', 'Tận tâm', 'Hòa giải'],
    weaknesses: ['Dễ bị tổn thương', 'Phụ thuộc', 'Thiếu quyết đoán', 'Quá nhạy cảm'],
    career: ['Cố vấn', 'Nhà ngoại giao', 'Nhân viên y tế', 'Giáo viên', 'Trợ lý'],
    love: 'Bạn cần một mối quan hệ ổn định và hài hòa. Tình yêu là ưu tiên hàng đầu trong cuộc đời bạn.',
    compatibility: [6, 8, 9],
    color: '#87CEEB',
    advices: [
      'Hãy tin tưởng vào bản thân nhiều hơn.',
      'Đừng sợ đưa ra ý kiến của mình.',
      'Học cách nói "không" khi cần thiết.',
      'Cân bằng giữa cho đi và nhận lại.',
      'Phát triển sự độc lập trong tình cảm.',
    ],
  },
  3: {
    number: 3,
    title: 'Người Truyền Cảm Hứng',
    description: 'Bạn là người sáng tạo, vui vẻ và có khả năng giao tiếp tuyệt vời. Bạn mang lại tiếng cười cho mọi người. Số 3 đại diện cho sự sáng tạo, biểu đạt và niềm vui.',
    strengths: ['Hài hước', 'Sáng tạo', 'Lạc quan', 'Giao tiếp tốt', 'Nghệ thuật'],
    weaknesses: ['Nông nổi', 'Thiếu kỷ luật', 'Hay thay đổi', 'Phung phí'],
    career: ['Nghệ sĩ', 'Diễn viên', 'Nhà văn', 'Giáo viên', 'Marketing', 'MC'],
    love: 'Bạn cần một người bạn đời vui vẻ và hiểu được sự tự do sáng tạo của bạn.',
    compatibility: [1, 5, 7],
    color: '#FFD700',
    advices: [
      'Tập trung vào một dự án thay vì lan man.',
      'Phát triển kỷ luật tự giác.',
      'Quản lý tài chính khôn ngoan hơn.',
      'Hoàn thành việc đã bắt đầu.',
      'Cân bằng giữa vui chơi và công việc.',
    ],
  },
  4: {
    number: 4,
    title: 'Người Xây Dựng',
    description: 'Bạn là người thực tế, chăm chỉ và đáng tin cậy. Bạn thích sự ổn định và trật tự. Số 4 đại diện cho nền tảng vững chắc và sự kiên định.',
    strengths: ['Kiên định', 'Tổ chức tốt', 'Trung thành', 'Chi tiết', 'Thực tế'],
    weaknesses: ['Cứng nhắc', 'Bảo thủ', 'Khó thích nghi', 'Quá cẩn thận'],
    career: ['Kỹ sư', 'Kế toán', 'Kiến trúc sư', 'Quản lý dự án', 'Ngân hàng'],
    love: 'Bạn cần một mối quan hệ ổn định lâu dài. Cam kết là rất quan trọng với bạn.',
    compatibility: [2, 8, 22],
    color: '#8B4513',
    advices: [
      'Mở lòng với những thay đổi tích cực.',
      'Đừng quá cứng nhắc trong tư duy.',
      'Cho phép bản thân thư giãn đôi khi.',
      'Tin tưởng vào người khác nhiều hơn.',
      'Cân bằng giữa công việc và cuộc sống.',
    ],
  },
  5: {
    number: 5,
    title: 'Người Tự Do',
    description: 'Bạn yêu thích sự tự do, mạo hiểm và những trải nghiệm mới. Bạn ghét sự ràng buộc và nhàm chán. Số 5 đại diện cho tự do, thay đổi và phiêu lưu.',
    strengths: ['Linh hoạt', 'Thích nghi nhanh', 'Dũng cảm', 'Quyến rũ', 'Đa năng'],
    weaknesses: ['Thiếu kiên nhẫn', 'Bốc đồng', 'Vô kỷ luật', 'Không ổn định'],
    career: ['Du lịch', 'Nhà báo', 'Sales', 'Phi công', 'Freelancer', 'Khởi nghiệp'],
    love: 'Bạn cần một người bạn đời năng động và hiểu được nhu cầu tự do của bạn.',
    compatibility: [1, 3, 7],
    color: '#FF6347',
    advices: [
      'Học cách kiên nhẫn và hoàn thành việc.',
      'Tạo ra sự ổn định trong cuộc sống.',
      'Quản lý tài chính cẩn thận.',
      'Cam kết với những gì quan trọng.',
      'Cân bằng giữa tự do và trách nhiệm.',
    ],
  },
  6: {
    number: 6,
    title: 'Người Chăm Sóc',
    description: 'Bạn là người giàu tình yêu thương, trách nhiệm và luôn quan tâm đến gia đình. Bạn thích che chở người khác. Số 6 đại diện cho tình yêu, trách nhiệm và hài hòa.',
    strengths: ['Bao dung', 'Trách nhiệm', 'Nghệ thuật', 'Chữa lành', 'Đồng cảm'],
    weaknesses: ['Hay lo lắng', 'Kiểm soát', 'Hy sinh thái quá', 'Hoàn hảo chủ nghĩa'],
    career: ['Y tá', 'Giáo viên', 'Thiết kế nội thất', 'Tư vấn', 'Nhà hàng'],
    love: 'Bạn là người yêu thương hết mình và cần một gia đình ấm áp hạnh phúc.',
    compatibility: [2, 4, 9],
    color: '#FFB6C1',
    advices: [
      'Chăm sóc bản thân trước khi chăm sóc người khác.',
      'Buông bỏ xu hướng kiểm soát.',
      'Không cần phải hoàn hảo.',
      'Học cách nhận sự giúp đỡ từ người khác.',
      'Đặt ra ranh giới cá nhân.',
    ],
  },
  7: {
    number: 7,
    title: 'Người Tri Thức',
    description: 'Bạn là người sâu sắc, thích phân tích và tìm tòi chân lý. Bạn thường có xu hướng sống nội tâm. Số 7 đại diện cho trí tuệ, tâm linh và sự tìm kiếm.',
    strengths: ['Thông minh', 'Phân tích sâu', 'Trực giác', 'Độc lập', 'Tâm linh'],
    weaknesses: ['Cô độc', 'Hay nghi ngờ', 'Khó hiểu', 'Xa cách', 'Hoài nghi'],
    career: ['Nhà nghiên cứu', 'Giáo sư', 'Nhà phân tích', 'Lập trình viên', 'Nhà triết học'],
    love: 'Bạn cần một người bạn đời hiểu được thế giới nội tâm sâu sắc của bạn.',
    compatibility: [3, 5, 9],
    color: '#9370DB',
    advices: [
      'Mở lòng với người khác nhiều hơn.',
      'Chia sẻ suy nghĩ và cảm xúc.',
      'Tìm kiếm sự cân bằng giữa lý trí và cảm xúc.',
      'Đừng quá hoài nghi về mọi thứ.',
      'Kết nối với cộng đồng đồng điệu.',
    ],
  },
  8: {
    number: 8,
    title: 'Người Điều Hành',
    description: 'Bạn là người mạnh mẽ, độc lập và có khả năng lãnh đạo. Bạn khao khát thành công về vật chất và quyền lực. Số 8 đại diện cho sức mạnh, thịnh vượng và quyền lực.',
    strengths: ['Lãnh đạo', 'Quyết đoán', 'Quản lý tài chính', 'Thực tế', 'Mạnh mẽ'],
    weaknesses: ['Thực dụng', 'Độc đoán', 'Lạnh lùng', 'Áp đặt', 'Vật chất'],
    career: ['CEO', 'Doanh nhân', 'Ngân hàng', 'Luật sư', 'Chính trị gia', 'Đầu tư'],
    love: 'Bạn cần một người bạn đời mạnh mẽ và hiểu được tham vọng của bạn.',
    compatibility: [2, 4, 6],
    color: '#DAA520',
    advices: [
      'Cân bằng giữa công việc và gia đình.',
      'Phát triển sự đồng cảm và lòng từ bi.',
      'Đừng để quyền lực làm mất bản thân.',
      'Chia sẻ thành công với người khác.',
      'Nhớ rằng tiền bạc không phải tất cả.',
    ],
  },
  9: {
    number: 9,
    title: 'Người Nhân Đạo',
    description: 'Bạn là người có tấm lòng bao dung, vị tha và hướng tới cộng đồng. Bạn muốn làm cho thế giới tốt đẹp hơn. Số 9 đại diện cho hoàn thiện, từ bi và phục vụ.',
    strengths: ['Từ bi', 'Sáng tạo', 'Lãng mạn', 'Hào phóng', 'Nhân đạo'],
    weaknesses: ['Mơ mộng thiếu thực tế', 'Dễ bị lợi dụng', 'Hay hy sinh', 'Lý tưởng hóa'],
    career: ['Từ thiện', 'Nghệ thuật', 'Y tế', 'Giáo dục', 'Môi trường', 'Tổ chức phi lợi nhuận'],
    love: 'Bạn yêu thương vô điều kiện và cần một người bạn đời chia sẻ lý tưởng của bạn.',
    compatibility: [3, 6, 7],
    color: '#FF69B4',
    advices: [
      'Đặt ra ranh giới cá nhân.',
      'Học cách nói "không" với người khác.',
      'Chăm sóc bản thân trước khi giúp đỡ người khác.',
      'Cân bằng lý tưởng với thực tế.',
      'Đừng để người khác lợi dụng lòng tốt của bạn.',
    ],
  },
  10: {
    number: 10,
    title: 'Người Tiên Phong',
    description: 'Bạn là người độc lập, tự tin và có tố chất lãnh đạo bẩm sinh. Bạn thích đi đầu và tạo ra con đường riêng. Số 10 kết hợp sức mạnh của 1 và tiềm năng của 0.',
    strengths: ['Tự tin', 'Quyết đoán', 'Sáng tạo', 'Dũng cảm', 'Độc lập'],
    weaknesses: ['Cái tôi lớn', 'Độc đoán', 'Thiếu kiên nhẫn', 'Ích kỷ'],
    career: ['Khởi nghiệp', 'Lãnh đạo', 'Sáng lập công ty', 'Đổi mới sáng tạo', 'Nghệ thuật'],
    love: 'Bạn cần một người bạn đời tôn trọng sự độc lập và tầm nhìn của bạn.',
    compatibility: [1, 3, 5],
    color: '#FF4500',
    advices: [
      'Học cách làm việc nhóm.',
      'Lắng nghe ý kiến người khác.',
      'Kiểm soát cái tôi của mình.',
      'Phát triển sự kiên nhẫn.',
      'Cân bằng giữa dẫn dắt và hợp tác.',
    ],
  },
  11: {
    number: 11,
    title: 'Người Khai Sáng (Master Number)',
    description: 'Bạn có trực giác tâm linh cực mạnh và khả năng truyền cảm hứng sâu sắc. Bạn nhạy cảm và tinh tế. Số 11 là Master Number đại diện cho giác ngộ và sứ mệnh cao cả.',
    strengths: ['Trực giác mạnh', 'Tâm linh', 'Nhạy cảm', 'Thấu cảm', 'Khai sáng'],
    weaknesses: ['Dễ bị stress', 'Mơ hồ', 'Quá nhạy cảm', 'Áp lực cao'],
    career: ['Tâm linh', 'Giáo viên tâm linh', 'Tư vấn', 'Nghệ thuật', 'Chữa lành'],
    love: 'Bạn cần một mối quan hệ sâu sắc về tâm linh và tinh thần.',
    compatibility: [2, 22, 33],
    color: '#E6E6FA',
    element: 'Ánh sáng',
    advices: [
      'Tin tưởng vào trực giác của bạn.',
      'Bảo vệ năng lượng cá nhân.',
      'Tìm kiếm sự cân bằng và nền tảng.',
      'Chia sẻ ánh sáng của bạn với thế giới.',
      'Thực hành thiền định và tự chăm sóc.',
    ],
  },
  22: {
    number: 22,
    title: 'Kiến Trúc Sư Đại Tài (Master Number)',
    description: 'Bạn có tầm nhìn lớn và khả năng biến những giấc mơ vĩ đại thành hiện thực. Bạn là sự kết hợp của số 4 và 11. Số 22 là Master Builder.',
    strengths: ['Tầm nhìn xa', 'Thực thi giỏi', 'Lãnh đạo', 'Kiến tạo', 'Tổ chức'],
    weaknesses: ['Áp lực lớn', 'Tham vọng quá mức', 'Stress cao', 'Hoàn hảo chủ nghĩa'],
    career: ['Kiến trúc sư', 'Doanh nhân lớn', 'Chính trị gia', 'Người thay đổi thế giới'],
    love: 'Bạn cần một người bạn đời hiểu và hỗ trợ tầm nhìn lớn lao của bạn.',
    compatibility: [4, 11, 33],
    color: '#4169E1',
    element: 'Đất và Ánh sáng',
    advices: [
      'Chia nhỏ mục tiêu lớn thành các bước nhỏ.',
      'Đừng quá tham vọng làm kiệt sức bản thân.',
      'Tìm kiếm sự hỗ trợ từ người khác.',
      'Cân bằng giữa mơ ước và thực tế.',
      'Nhớ rằng hành trình quan trọng như đích đến.',
    ],
  },
  33: {
    number: 33,
    title: 'Người Chữa Lành Vĩ Đại (Master Number)',
    description: 'Con số hiếm gặp. Bạn mang tình yêu thương vô điều kiện và sứ mệnh chữa lành cho mọi người. Số 33 là Master Teacher.',
    strengths: ['Bác ái', 'Chữa lành', 'Hướng thiện', 'Hy sinh', 'Từ bi vô biên'],
    weaknesses: ['Gánh vác quá nhiều', 'Quên bản thân', 'Cạn kiệt', 'Áp lực'],
    career: ['Chữa lành', 'Giáo viên tâm linh', 'Y tế', 'Nhân đạo', 'Lãnh đạo tinh thần'],
    love: 'Bạn yêu thương toàn nhân loại. Cần học cách yêu thương bản thân trước.',
    compatibility: [6, 9, 11, 22],
    color: '#00CED1',
    element: 'Thần thánh',
    advices: [
      'Đặt bản thân lên hàng đầu.',
      'Học cách nhận tình yêu từ người khác.',
      'Đừng cố gắng cứu rỗi cả thế giới một mình.',
      'Tìm kiếm sự cân bằng trong cuộc sống.',
      'Nhớ rằng bạn cũng cần được chữa lành.',
    ],
  },
};

// Helper function to get number data
export function getNumerologyData(number: number): NumerologyNumberData | null {
  return NUMEROLOGY_DATA[number] || null;
}

// All valid life path numbers
export const VALID_LIFE_PATH_NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33];
