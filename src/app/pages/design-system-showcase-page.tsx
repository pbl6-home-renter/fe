


// TRANG NI ĐỂ PREVIEW CÁC COMPONENT CHUNG CỦA HỆ THỐNG, 
// KHÔNG CHỨA LOGIC NGHIỆP VỤ




import { useState } from 'react';
import {
  Search,
  Mail,
  Home,
  Building,
  FileText,
  AlertCircle,
  Plus,
  RefreshCw,
  Trash2,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { NumberInput } from '@/components/ui/number-input';
import { Textarea } from '@/components/ui/textarea';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusDot } from '@/components/ui/status-dot';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { ProgressMeterTrack } from '@/components/ui/progress-meter';
import { Divider } from '@/components/ui/divider';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { Skeleton } from '@/components/feedback/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { AlertBanner } from '@/components/feedback/alert-banner';

export const DesignSystemShowcasePage = () => {
  // Interactive state demos
  const [modalOpen, setModalOpen] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [activeTag, setActiveTag] = useState('wifi');
  const [numericMoney, setNumericMoney] = useState<number | undefined>(5200000);
  const [selectVal, setSelectVal] = useState('201');
  const [progressVal, setProgressVal] = useState(75);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryDemo = () => {
    setIsRetrying(true);
    setTimeout(() => setIsRetrying(false), 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 text-left">
      {/* Header Banner */}
      <div className="bg-rentify-surface rounded-2xl border border-rentify-divider p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rentify-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-rentify-primary">
              Rentify Design Foundation
            </span>
            <Badge variant="primary">v1.0 • PBL6</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rentify-text-primary tracking-tight">
            Base Components & Design Tokens Showcase
          </h1>
          <p className="text-sm text-rentify-text-secondary mt-1 max-w-2xl leading-relaxed">
            Hệ thống thành phần dùng chung (Strict Shared UI Scope) tuân thủ 100% tài liệu{' '}
            <code className="text-xs bg-rentify-primary-container/60 text-rentify-primary px-1.5 py-0.5 rounded font-mono">
              results.md
            </code>
            . Không chứa logic nghiệp vụ, sẵn sàng cho cả 3 phân hệ Tenant, Landlord và Admin.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          className="shrink-0 gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Mở Modal Demo</span>
        </Button>
      </div>

      {/* 1. Buttons & IconButtons */}
      <Card>
        <CardHeader>
          <CardTitle>1. Buttons & IconButtons (Variants & Sizes)</CardTitle>
          <CardDescription>
            Các biến thể nút bấm chuẩn: Primary, Secondary, Outline, Ghost, Destructive; kích thước sm (32px), md (42px), lg (48px); trạng thái loading và disabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variants */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rentify-text-secondary mb-3">
              Variants (Size md)
            </h4>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary">Primary CTA</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Border</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive / Delete</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rentify-text-secondary mb-3">
              Sizes (sm, md, lg) & Loading States
            </h4>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small (32px)</Button>
              <Button size="md">Medium (42px)</Button>
              <Button size="lg">Large (48px)</Button>
              <Button isLoading size="md">
                Đang lưu...
              </Button>
              <Button disabled size="md">
                Disabled State
              </Button>
            </div>
          </div>

          {/* Icon Buttons */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rentify-text-secondary mb-3">
              IconButtons (Accessible with aria-label)
            </h4>
            <div className="flex flex-wrap gap-3 items-center">
              <IconButton variant="primary" size="md" aria-label="Thêm mới">
                <Plus className="w-4 h-4" />
              </IconButton>
              <IconButton variant="secondary" size="md" aria-label="Làm mới">
                <RefreshCw className="w-4 h-4" />
              </IconButton>
              <IconButton variant="outline" size="md" aria-label="Chia sẻ">
                <Share2 className="w-4 h-4" />
              </IconButton>
              <IconButton variant="ghost" size="md" aria-label="Xóa">
                <Trash2 className="w-4 h-4 text-rentify-error" />
              </IconButton>
              <IconButton variant="ghost" size="sm" aria-label="Tìm kiếm">
                <Search className="w-3.5 h-3.5" />
              </IconButton>
              <IconButton isLoading variant="outline" size="md" aria-label="Đang tải">
                <RefreshCw className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Form Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>2. Primitive Form Controls (Inputs, Select, Checkbox)</CardTitle>
          <CardDescription>
            Các ô nhập chuẩn: TextInput, PasswordInput, NumberInput (tự format VNĐ &amp; tabular-nums), Textarea, SelectDropdown, Checkbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TextInput with Icon */}
            <Input
              label="Họ và tên khách thuê"
              placeholder="Nguyễn Văn A"
              defaultValue="Nguyễn Văn An"
              helperText="Nhập đầy đủ họ tên theo CCCD"
              leadingIcon={<Search className="w-4 h-4" />}
            />

            {/* TextInput with Error */}
            <Input
              label="Địa chỉ Email"
              type="email"
              placeholder="user@rentify.vn"
              defaultValue="invalid-email"
              error="Định dạng email không hợp lệ"
              leadingIcon={<Mail className="w-4 h-4" />}
            />

            {/* PasswordInput */}
            <PasswordInput
              label="Mật khẩu bảo mật"
              placeholder="Nhập mật khẩu..."
              defaultValue="SuperSecret123!"
              helperText="Tối thiểu 8 ký tự kèm chữ hoa, số và ký tự đặc biệt"
            />

            {/* NumberInput with VNĐ format & tabular-nums */}
            <NumberInput
              label="Tiền thuê hàng tháng (formatVnd)"
              value={numericMoney}
              onChangeValue={setNumericMoney}
              formatVnd
              helperText={`Giá trị số thực tế: ${numericMoney ?? 0} đ (tabular-nums)`}
            />

            {/* SelectDropdown */}
            <SelectDropdown
              label="Chọn phòng trọ"
              value={selectVal}
              onChange={(e) => setSelectVal(e.target.value)}
              options={[
                { value: '101', label: 'Phòng 101 — Tầng 1 (Đang trống)' },
                { value: '201', label: 'Phòng 201 — Tầng 2 (Đã thuê)' },
                { value: '301', label: 'Phòng 301 — Tầng 3 (Bảo trì)', disabled: true },
              ]}
              leadingIcon={<Home className="w-4 h-4" />}
              helperText="Danh sách phòng khả dụng theo hợp đồng"
            />

            {/* Checkboxes */}
            <div className="flex flex-col gap-3 pt-2">
              <span className="text-sm font-medium text-rentify-text-primary">
                Tùy chọn tiện ích phòng
              </span>
              <div className="flex flex-col gap-2.5">
                <Checkbox
                  label="Bao gồm chi phí dọn dẹp vệ sinh chung"
                  helperText="Thu cố định 50.000 đ/người/tháng"
                  checked={checkboxVal}
                  onChange={(e) => setCheckboxVal(e.target.checked)}
                />
                <Checkbox
                  label="Chỗ đỗ xe máy định danh"
                  defaultChecked
                />
                <Checkbox
                  label="Dịch vụ giặt sấy tự động (Tạm hết suất)"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Textarea */}
          <Textarea
            label="Ghi chú điều khoản hợp đồng"
            placeholder="Nhập nội dung cam kết, điều khoản hoàn cọc..."
            defaultValue="Khách thuê giữ gìn vệ sinh chung, không gây ồn ào sau 23h00. Tiền cọc được hoàn trả 100% khi thanh lý hợp đồng đúng hạn."
            showCount
            maxLength={200}
            rows={3}
            helperText="Tối đa 200 ký tự"
          />
        </CardContent>
      </Card>

      {/* 3. Indicators: StatusDot, Badges, Avatar, ProgressMeter */}
      <Card>
        <CardHeader>
          <CardTitle>3. Indicators, Badges &amp; Metrics</CardTitle>
          <CardDescription>
            StatusDot (7x7px với 4 màu ngữ nghĩa), OutlinedTag (bo góc 7px), Avatar người dùng, và ProgressMeterTrack tự chuyển cảnh báo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Dots */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rentify-text-secondary mb-3">
              StatusDot (Semantic 7x7px Dots)
            </h4>
            <div className="flex flex-wrap gap-5 items-center bg-rentify-surface-container-low p-4 rounded-xl border border-rentify-divider">
              <StatusDot variant="paid" label="Đã thanh toán (Paid)" />
              <StatusDot variant="overdue" label="Quá hạn đóng tiền (Overdue)" pulse />
              <StatusDot variant="pending" label="Chờ duyệt hồ sơ (Pending)" />
              <StatusDot variant="primary" label="Hợp đồng hiệu lực (Active)" />
            </div>
          </div>

          {/* Outlined Tags / Badges */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rentify-text-secondary mb-3">
              OutlinedTag / Filter Badges (Radius 7px)
            </h4>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Badge
                interactive
                active={activeTag === 'all'}
                onClick={() => setActiveTag('all')}
              >
                Tất cả phòng (12)
              </Badge>
              <Badge
                interactive
                active={activeTag === 'wifi'}
                onClick={() => setActiveTag('wifi')}
              >
                Wi-Fi tốc độ cao
              </Badge>
              <Badge
                interactive
                active={activeTag === 'ac'}
                onClick={() => setActiveTag('ac')}
              >
                Điều hòa Inverter
              </Badge>
              <Badge variant="success">Hoạt động tốt</Badge>
              <Badge variant="warning">Sắp hết hạn</Badge>
              <Badge variant="error">Đang có sự cố</Badge>
              <Badge variant="primary">VietQR Khả dụng</Badge>
            </div>
          </div>

          {/* Avatars */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rentify-text-secondary mb-3">
              Avatar (Sizes, Initials, Image &amp; Online Status)
            </h4>
            <div className="flex flex-wrap gap-4 items-center">
              <Avatar size="sm" name="Trần Văn Ba" status="online" />
              <Avatar size="md" name="Nguyễn Thị Mai" status="busy" />
              <Avatar size="lg" name="Lê Hữu Đạt" status="offline" />
              <Avatar size="xl" name="Chủ trọ Rentify" />
              <Avatar size="md" /> {/* Fallback icon */}
            </div>
          </div>

          {/* Progress Meter Track */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-rentify-text-secondary">
                ProgressMeterTrack (Auto Warning khi &gt;= 100%)
              </h4>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgressVal((p) => Math.max(0, p - 25))}
                >
                  -25%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgressVal((p) => Math.min(125, p + 25))}
                >
                  +25%
                </Button>
              </div>
            </div>
            <ProgressMeterTrack
              value={progressVal}
              max={100}
              label={`Tiến độ thu tiền phòng tháng 10 (${progressVal}% định mức)`}
              showValue
              size="md"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Feedback Components */}
      <Card>
        <CardHeader>
          <CardTitle>4. Feedback Components (Alerts, Skeletons, Empty &amp; Error)</CardTitle>
          <CardDescription>
            AlertBanner thông báo 4 sắc thái, Skeleton placeholder, EmptyState thân thiện và ErrorState có nút thử lại.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alert Banners */}
          <div className="space-y-3">
            <AlertBanner
              variant="success"
              title="Thanh toán VietQR thành công"
              dismissible
            >
              Hóa đơn #INV-2026-10-001 của phòng 201 đã được đối soát tự động qua ngân hàng.
            </AlertBanner>

            <AlertBanner
              variant="warning"
              title="Cảnh báo chỉ số điện bất thường"
              dismissible
            >
              Phòng 302 tiêu thụ 450 kWh trong tháng này (tăng 220% so với kỳ trước).
            </AlertBanner>

            <AlertBanner
              variant="error"
              title="Chưa kết nối tài khoản ngân hàng thụ hưởng"
              action={
                <Button size="sm" variant="outline" className="bg-white/80">
                  Cài đặt ngay
                </Button>
              }
            >
              Vui lòng thiết lập tài khoản nhận tiền để tự động tạo mã QR trên hóa đơn.
            </AlertBanner>
          </div>

          <Divider>KHỐI TRẠNG THÁI DỮ LIỆU</Divider>

          {/* Skeletons & Spinners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-rentify-divider bg-rentify-surface space-y-3">
              <span className="text-xs font-semibold text-rentify-text-secondary">
                Skeleton Card Placeholder
              </span>
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-1.5">
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
              <Skeleton variant="rectangular" height={48} />
            </div>

            <div className="p-4 rounded-xl border border-rentify-divider bg-rentify-surface flex flex-col items-center justify-center gap-3">
              <span className="text-xs font-semibold text-rentify-text-secondary">
                Loading Spinners
              </span>
              <div className="flex items-center gap-4">
                <LoadingSpinner size="sm" color="primary" />
                <LoadingSpinner size="md" color="primary" />
                <LoadingSpinner size="lg" color="primary" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-rentify-divider bg-rentify-surface flex items-center justify-center">
              <StatusDot variant="overdue" label="Cảnh báo hệ thống" pulse />
            </div>
          </div>

          {/* Empty State */}
          <div className="border border-rentify-divider rounded-2xl bg-rentify-surface overflow-hidden">
            <EmptyState
              icon={Building}
              title="Chưa có tòa nhà nào trong hệ thống"
              description="Bắt đầu quản lý kinh doanh phòng trọ bằng cách tạo tòa nhà đầu tiên của bạn."
              actionText="Thêm tòa nhà mới"
              onAction={() => alert('Demo CTA Click')}
            />
          </div>

          {/* Error State */}
          <div className="border border-rentify-divider rounded-2xl bg-rentify-surface overflow-hidden">
            <ErrorState
              icon={AlertCircle}
              title="Mất kết nối với máy chủ"
              message="Không thể đồng bộ chỉ số điện nước tự động. Vui lòng kiểm tra đường truyền và thử lại."
              retryText="Thử kết nối lại"
              onRetry={handleRetryDemo}
              isRetrying={isRetrying}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Interactive Dialog Demo */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Xác nhận thanh toán tiền mặt"
        description="Vui lòng kiểm tra kỹ số tiền thực tế trước khi xác nhận gạch nợ cho khách thuê."
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                alert('Đã xác nhận thanh toán thành công!');
                setModalOpen(false);
              }}
            >
              Xác nhận gạch nợ
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="p-3.5 rounded-xl bg-rentify-surface-container-low border border-rentify-divider flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-rentify-primary" />
              <div>
                <p className="text-xs text-rentify-text-secondary">Mã hóa đơn</p>
                <p className="text-sm font-semibold text-rentify-text-primary">#INV-2026-10-001</p>
              </div>
            </div>
            <StatusDot variant="paid" label="Phòng 201" />
          </div>

          <NumberInput
            label="Số tiền thực thu (VNĐ)"
            defaultValue={3500000}
            formatVnd
            helperText="Nhập đúng số tiền khách đã trao tay"
          />

          <Textarea
            label="Ghi chú thu tiền"
            placeholder="Ví dụ: Khách gửi tiền mặt lúc 14h30 tại quầy..."
            rows={2}
          />
        </div>
      </Dialog>
    </div>
  );
};
