import { Package, Plus, List, Settings, Users, BarChart, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface AdminHeaderProps {
  activeView: 'list' | 'add';
  onViewChange: (view: 'list' | 'add') => void;
}

export function AdminHeader({ activeView, onViewChange }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Package className="w-7 h-7 text-green-600" />
              <div>
                <h1 className="text-lg">App Manager</h1>
                <p className="text-xs text-gray-500">Панель администратора</p>
              </div>
            </div>

            <nav className="flex items-center gap-1">
              <Button
                variant={activeView === 'list' ? 'secondary' : 'ghost'}
                className="gap-2"
                onClick={() => onViewChange('list')}
              >
                <List className="w-4 h-4" />
                Все приложения
              </Button>
              
              <Button variant="ghost" className="gap-2">
                <Users className="w-4 h-4" />
                Пользователи
              </Button>
              
              <Button variant="ghost" className="gap-2">
                <BarChart className="w-4 h-4" />
                Статистика
              </Button>
              
              <Button variant="ghost" className="gap-2">
                <Settings className="w-4 h-4" />
                Настройки
              </Button>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                  А
                </div>
                <div className="text-left">
                  <p className="text-sm">Администратор</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Настройки профиля
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
