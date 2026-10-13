import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const LoginPage = () => {
  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
        <CardDescription>Nhập thông tin tài khoản để truy cập hệ thống Rentify</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Email" type="email" placeholder="email@example.com" />
          <Input label="Mật khẩu" type="password" placeholder="••••••••" />
          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;

