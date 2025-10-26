import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCurrentUser, isLoggedIn, login, getStoredCredentials, storeCredentials } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import logo from '@/images/logo1.png';

const LandingLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);

  // If already logged in, route to the right dashboard
  useEffect(() => {
    if (isLoggedIn()) {
      const user = getCurrentUser();
      if (!user) return;
      switch (user.role) {
        case 'super_admin':
          navigate('/super-admin-dashboard');
          break;
        case 'plant_admin':
          navigate('/plant-admin-dashboard');
          break;
        case 'user':
          navigate('/user-welcome');
          break;
      }
    }
  }, [navigate]);

  // Load stored credentials
  useEffect(() => {
    const stored = getStoredCredentials();
    if (stored) {
      setLoginId(stored.email);
      setPassword(stored.password);
      setRememberMe(true);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(loginId, password, company);
      if (result.success && result.user) {
        storeCredentials(loginId, password, rememberMe);
        toast({ title: 'Login Successful', description: `Welcome ${result.user.role.replace('_', ' ')}` });
        switch (result.user.role) {
          case 'super_admin':
            navigate('/super-admin-dashboard');
            break;
          case 'plant_admin':
            navigate('/plant-admin-dashboard');
            break;
          case 'user':
          default:
            navigate('/user-welcome');
        }
      } else {
        toast({ title: 'Login Failed', description: result.error || 'Invalid credentials', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Login Failed', description: 'An error occurred during login', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start md:items-center justify-center bg-gradient-to-b from-white to-blue-50 py-6 md:py-8">
      <Card className="w-full max-w-md p-5 md:p-6 shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          {/* Replace text heading with company logo */}
          <div className="mx-auto w-[200px] h-[75px] md:w-[240px] md:h-[90px] flex items-center justify-center mb-3">
            <img src={logo} alt="Company Logo" className="w-full h-full object-contain"/>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Solar Panels Analysis</h1>
          <h2 className="mt-2 text-base md:text-lg font-semibold">Login Entry</h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name:</Label>
            <Input id="company" placeholder="Enter company name" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login">Login:</Label>
            <Input id="login" placeholder="Enter email or username" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password:</Label>
            <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Category:</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              {/* Open the dropdown to the right side of the trigger */}
              <SelectContent position="popper" side="right" align="start" sideOffset={8}>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="mgmt">Mgmt.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(Boolean(c))} />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button type="submit" className="w-full h-10 text-sm md:text-base">OK</Button>
        </form>
      </Card>
    </div>
  );
};

export default LandingLogin;
