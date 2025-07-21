import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (email: string) => void;
  language: 'ru' | 'en';
}

export const AuthModal = ({ isOpen, onClose, onAuthSuccess, language }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const { toast } = useToast();

  const texts = {
    ru: {
      signIn: 'Вход',
      signUp: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      name: 'Имя',
      loginButton: 'Войти',
      registerButton: 'Зарегистрироваться',
      loginSuccess: 'Вход выполнен успешно',
      registerSuccess: 'Регистрация завершена',
      invalidEmail: 'Неверный формат email',
      passwordMismatch: 'Пароли не совпадают',
      shortPassword: 'Пароль должен содержать минимум 6 символов',
      fillAllFields: 'Заполните все поля',
      welcomeBack: 'Добро пожаловать!',
      accountCreated: 'Аккаунт создан!'
    },
    en: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Name',
      loginButton: 'Sign In',
      registerButton: 'Sign Up',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration completed',
      invalidEmail: 'Invalid email format',
      passwordMismatch: 'Passwords do not match',
      shortPassword: 'Password must be at least 6 characters',
      fillAllFields: 'Please fill all fields',
      welcomeBack: 'Welcome back!',
      accountCreated: 'Account created!'
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast({
        title: texts[language].fillAllFields,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!validateEmail(loginData.email)) {
      toast({
        title: texts[language].invalidEmail,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    
    // Имитация запроса к серверу
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess(loginData.email);
      toast({
        title: texts[language].welcomeBack,
        description: texts[language].loginSuccess,
        duration: 3000,
      });
      onClose();
      setLoginData({ email: '', password: '' });
    }, 1000);
  };

  const handleRegister = async () => {
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: texts[language].fillAllFields,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!validateEmail(registerData.email)) {
      toast({
        title: texts[language].invalidEmail,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: texts[language].shortPassword,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: texts[language].passwordMismatch,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    
    // Имитация запроса к серверу
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess(registerData.email);
      toast({
        title: texts[language].accountCreated,
        description: texts[language].registerSuccess,
        duration: 3000,
      });
      onClose();
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Amanda
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{texts[language].signIn}</TabsTrigger>
            <TabsTrigger value="register">{texts[language].signUp}</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{texts[language].email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="pl-10"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">{texts[language].password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  texts[language].loginButton
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">{texts[language].name}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="pl-10"
                    placeholder="Ваше имя"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">{texts[language].email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="pl-10"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">{texts[language].password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">{texts[language].confirmPassword}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button 
                onClick={handleRegister} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  texts[language].registerButton
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};