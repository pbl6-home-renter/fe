# Hướng Dẫn & Quy Chuẩn Đa Ngôn Ngữ (i18n Guidelines) — Rentify Frontend

Tài liệu này quy định các tiêu chuẩn và nguyên tắc bắt buộc khi làm việc với hệ thống đa ngôn ngữ (`react-i18next` + `i18next`) trong dự án Rentify Frontend (`fe/`).

---

## 1. Cấu Trúc File & Namespaces

Hệ thống tài nguyên ngôn ngữ được đặt tại `fe/src/i18n/locales/{lang}/`:
```
fe/src/i18n/
├── i18n.ts                   # Khởi tạo instance i18next & react-i18next
├── i18n.d.ts                 # TypeScript declaration cho auto-complete & type-safety
└── locales/
    ├── vi/                   # Ngôn ngữ Tiếng Việt (Default / Source of Truth)
    │   ├── common.json       # Dùng chung (nút bấm, layout, navigation, errors, footer)
    │   └── auth.json         # Phân hệ Xác thực (login, register, forgot-password)
    └── en/                   # Ngôn ngữ Tiếng Anh
        ├── common.json
        └── auth.json
```

### Nguyên tắc Namespace:
1. **`common` (Default Namespace)**: Chứa các text dùng chung toàn ứng dụng (nút bấm: `save`, `cancel`; layout: `appName`, `footer`; điều hướng: `navigation.*`; thông báo lỗi: `errors.*`). Khi gọi `useTranslation()` không truyền namespace thì mặc định dùng `common`.
2. **Feature Namespaces**: Các màn hình/phân hệ có từ vựng chuyên biệt lớn (như `auth`, `contracts`, `billing`) được tách thành file JSON riêng để tránh phình to file `common.json`.
3. **Đồng bộ song song**: Khi thêm/sửa bất kỳ key nào ở `vi/`, **bắt buộc** phải cập nhật đồng thời ở `en/` với cùng cấu trúc cây.

---

## 2. Quy Tắc Đặt Key (Naming Conventions)

1. **Format**: Sử dụng **camelCase** cho cả object key và leaf key.
   - ✅ Chuẩn: `appName`, `loginSubtitle`, `vietqrContract`, `backHome`
   - ❌ Tránh: `app_name`, `App-Name`, `LOGIN_SUBTITLE`

2. **Cấu trúc phân cấp theo ngữ cảnh (Contextual Nesting)**:
   - Các từ khóa đơn lẻ hoặc dùng lặp lại nhiều lần: đặt ở cấp root (ví dụ: `save`, `cancel`, `loading`, `error`).
   - Các nhóm chức năng cụ thể: nhóm vào object có ngữ nghĩa:
     ```json
     {
       "navigation": {
         "overview": "Tổng quan",
         "rooms": "Quản lý nhà / phòng",
         "contracts": "Hợp đồng"
       },
       "errors": {
         "forbidden": {
           "title": "Truy cập bị từ chối",
           "description": "Bạn không có quyền truy cập trang này."
         }
       }
     }
     ```

---

## 3. Vị Trí & Cách Sử Dụng Translation Key

### A. Dùng trực tiếp trong React Component (Trực tiếp)
- Sử dụng hook `useTranslation()`:
```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  // Dùng default namespace 'common'
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('appName')}</h1>
      <button>{t('save')}</button>
    </div>
  );
};
```
- Khi sử dụng namespace khác (ví dụ: `auth`):
```tsx
export const LoginPage = () => {
  const { t } = useTranslation('auth');

  return <h1>{t('login')}</h1>;
};
```

### B. Dùng gián tiếp trong file cấu hình / Constants (Indirect Key)
- **Tuyệt đối KHÔNG** gọi hàm `i18n.t(...)` trong các file constants/config (vì text sẽ bị cố định tại thời điểm import và không tự đổi ngôn ngữ khi người dùng chuyển switch language).
- **Quy chuẩn**: Khai báo chuỗi translation key (ví dụ: `titleKey`) trong config, sau đó component hiển thị sẽ gọi `t(item.titleKey)`:
```typescript
// fe/src/constants/navigation.ts
export interface MenuItem {
  titleKey: string; // ✅ Lưu key thay vì text đã dịch
  path: string;
  icon: LucideIcon;
}

export const LANDLORD_MENU_ITEMS: readonly MenuItem[] = [
  { titleKey: 'navigation.overview', path: '/dashboard', icon: LayoutDashboard },
  { titleKey: 'navigation.rooms', path: '/rooms', icon: Building },
];
```
```tsx
// fe/src/app/layouts/dashboard-layout.tsx
const { t } = useTranslation();

return (
  <nav>
    {menuItems.map((item) => (
      <NavLink key={item.path} to={item.path}>
        <span>{t(item.titleKey as Parameters<typeof t>[0])}</span>
      </NavLink>
    ))}
  </nav>
);
```

---

## 4. Xử Lý Dynamic Strings & Pluralization

### A. Nội suy biến động (Interpolation)
Trong file JSON, sử dụng cú pháp hai dấu ngoặc nhọn `{{variableName}}`:
```json
// locales/vi/common.json
{
  "footer": {
    "copyright": "© {{year}} Rentify. Tất cả quyền được bảo lưu."
  },
  "welcome": "Xin chào, {{name}}!"
}
```
Trong React Component:
```tsx
const { t } = useTranslation();

return (
  <div>
    <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
    <p>{t('welcome', { name: user?.name || 'Khách' })}</p>
  </div>
);
```

### B. Số nhiều / Định lượng (Pluralization)
`i18next` hỗ trợ tự động xử lý số nhiều qua hậu tố `_one`, `_other`:
```json
// locales/en/common.json
{
  "roomCount_one": "{{count}} room available",
  "roomCount_other": "{{count}} rooms available"
}
```
```tsx
t('roomCount', { count: rooms.length });
```

---

## 5. Checklist Khi Thêm / Chỉnh Sửa i18n
1. ✅ Key đã được định nghĩa ở cả 2 file: `vi/{namespace}.json` và `en/{namespace}.json`.
2. ✅ Key tuân thủ định dạng `camelCase` và phân cấp hợp lý.
3. ✅ TypeScript typecheck không báo lỗi (`npm run build` hoặc `tsc -b`).
4. ✅ Không hardcode chuỗi hiển thị tĩnh giao diện bằng tiếng Việt/tiếng Anh trong file JSX/TSX.

