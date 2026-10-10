# HUỲNH TRUNG HIẾU · MSSV 23734711 · https://github.com/langocthan/23734711_TH2.git · Stamp #043948 · Số cuối 1 — VARIANT B

# KTXGo — THỰC HÀNH 2

Ứng dụng React Native CLI đặt món và giao đến phòng ký túc xá. Project này được tạo mới cho TH2, độc lập với ShopAI.

## Thông tin cá nhân hóa

- Họ tên: **HUỲNH TRUNG HIẾU**
- MSSV: **23734711**
- Stamp: **043948**
- Seed: `711`
- Phòng giao: `P.411`
- Ô đăng nhập: số điện thoại
- Thứ tự tab: Cửa hàng → Giỏ → Tôi
- Haptic khi thêm món: selection
- Công thức ship: B
- Chi tiết món: card
- Debounce tìm kiếm: `400 ms`
- React Query stale time: `21.000 ms`
- Hệ số giá: `30.500`
- Phí ship cơ bản: `9.000 đ`
- ID ảnh banner: `511`

Các giá trị trên được tính từ [src/constants/student.ts](./src/constants/student.ts). Repo nộp bài: [langocthan/23734711_TH2](https://github.com/langocthan/23734711_TH2).

## Yêu cầu môi trường

- Node.js `>= 22.11.0`
- JDK 17
- Android Studio, Android SDK và một Android Emulator

## Cài đặt và chạy Android

```powershell
npm install
npm start
```

Mở terminal thứ hai tại thư mục project:

```powershell
npm run android
```

Ở lần chạy đầu, Gradle cần tải các thư viện Android và biên dịch native modules; việc này có thể mất vài phút. Để chạy nhanh hơn trên emulator hiện tại:

```powershell
npm run android -- --active-arch-only
```

Ứng dụng hiển thị danh mục mẫu gồm cơm tấm, trà sữa, bút bi và mì ly, với màu khung riêng cho từng sản phẩm. Home kiểm tra kết nối Fake Store API trước khi hiển thị danh mục; khi mất mạng sẽ hiện MSSV, thông báo lỗi và nút **Thử lại**. Cho phép vị trí khi được hỏi để tính phí giao hàng; trên emulator có thể đặt tọa độ giả lập trong **Extended controls → Location**. Nếu quyền vị trí bị chặn, mở trang Cài đặt ứng dụng từ tab **Tôi**.

## Kiểm tra

```powershell
npm test -- --runInBand
npx tsc --noEmit
npm run lint
```

## Trước khi nộp bài

- Kiểm tra repo GitHub `23734711_TH2` và chép link clone HTTPS vào đề thi.
- Thực hiện tối thiểu bốn commit trong giờ thi, mỗi commit message có MSSV và `TH2`; không force-push.
- Chụp ảnh màn hình trang Cửa hàng và Giỏ, lưu thành `docs/screenshot-th2-home.png` và `docs/screenshot-th2-cart.png`.
- Đẩy source lên repo, kiểm tra link clone HTTPS và chép link vào đề thi.
- Không đưa thông tin đăng nhập, token hay bí mật vào repo.
