import { useState, useMemo } from 'react';
import { Search, Plus, MoreVertical, Trash2, Edit, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

interface Application {
  id: number;
  name: string;
  package: string;
  description: string;
  version: string;
  category: string;
  size: string;
  osVersion: string;
  status: string;
  website?: string;
  license?: string;
  changelog?: string;
  tags?: string[];
  analogs?: string[];
}

interface ApplicationsListProps {
  onAddNew: () => void;
  onEdit: (app: Application) => void;
}

type SortField = 'name' | 'version' | 'category' | 'size' | 'osVersion' | null;
type SortOrder = 'asc' | 'desc' | null;

const mockApplications: Application[] = [
  {
    id: 1,
    name: 'Visual Studio Code',
    package: 'code',
    description: 'Редактор кода от Microsoft',
    version: '1.85.0',
    category: 'Разработка',
    size: '85',
    osVersion: 'Debian 11+',
    status: 'active',
    website: 'https://code.visualstudio.com/',
    license: 'MIT'
  },
  {
    id: 2,
    name: 'Firefox',
    package: 'firefox',
    description: 'Свободный браузер от Mozilla',
    version: '120.0',
    category: 'Браузеры',
    size: '65',
    osVersion: 'Debian 10+',
    status: 'active',
    website: 'https://www.mozilla.org/firefox/',
    license: 'MPL-2.0'
  },
  {
    id: 3,
    name: 'GIMP',
    package: 'gimp',
    description: 'Редактор растровой графики',
    version: '2.10.36',
    category: 'Графика',
    size: '120',
    osVersion: 'Debian 11+',
    status: 'active',
    website: 'https://www.gimp.org/',
    license: 'GPL-3.0'
  },
  {
    id: 4,
    name: 'LibreOffice',
    package: 'libreoffice',
    description: 'Офисный пакет',
    version: '7.6.2',
    category: 'Офисные',
    size: '280',
    osVersion: 'Debian 10+',
    status: 'active',
    website: 'https://www.libreoffice.org/',
    license: 'MPL-2.0'
  },
  {
    id: 5,
    name: 'Blender',
    package: 'blender',
    description: '3D редактор и аниматор',
    version: '4.0.0',
    category: '3D графика',
    size: '310',
    osVersion: 'Debian 12+',
    status: 'pending',
    website: 'https://www.blender.org/',
    license: 'GPL-2.0'
  },
];

export function ApplicationsList({ onAddNew, onEdit }: ApplicationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [osVersionFilter, setOsVersionFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = mockApplications.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
      const matchesOsVersion = osVersionFilter === 'all' || app.osVersion === osVersionFilter;
      
      return matchesSearch && matchesCategory && matchesOsVersion;
    });

    if (sortField && sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, categoryFilter, osVersionFilter, sortField, sortOrder]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedApplications.slice(startIndex, endIndex);
  }, [filteredAndSortedApplications, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedApplications.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleDeleteClick = (app: Application) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (appToDelete) {
      toast.success(`Приложение "${appToDelete.name}" удалено`);
      setDeleteDialogOpen(false);
      setAppToDelete(null);
    }
  };

  const categories = Array.from(new Set(mockApplications.map(app => app.category)));
  const osVersions = Array.from(new Set(mockApplications.map(app => app.osVersion)));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Управление приложениями</h2>
        <p className="text-gray-600">Список всех доступных приложений для установки</p>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск приложений..."
            className="pl-10 w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Добавить приложение
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">Фильтры:</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Категория:</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Версия ОС:</label>
          <Select value={osVersionFilter} onValueChange={setOsVersionFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите версию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все версии</SelectItem>
              {osVersions.map(version => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="gap-2 hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Название
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="gap-2 hover:bg-gray-100"
                  onClick={() => handleSort('version')}
                >
                  Версия
                  {getSortIcon('version')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="gap-2 hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  Категория
                  {getSortIcon('category')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="gap-2 hover:bg-gray-100"
                  onClick={() => handleSort('size')}
                >
                  Размер
                  {getSortIcon('size')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="gap-2 hover:bg-gray-100"
                  onClick={() => handleSort('osVersion')}
                >
                  Версия ОС
                  {getSortIcon('osVersion')}
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
                      {app.name.charAt(0)}
                    </div>
                    <span>{app.name}</span>
                  </div>
                </TableCell>
                <TableCell>{app.version}</TableCell>
                <TableCell>{app.category}</TableCell>
                <TableCell>{app.size} МБ</TableCell>
                <TableCell>
                  <Badge variant="outline">{app.osVersion}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(app)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteClick(app)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            Показано {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedApplications.length)} из {filteredAndSortedApplications.length} приложений
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Показывать:</span>
            <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Назад
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Далее
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить приложение?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить приложение <span className="font-semibold text-gray-900">"{appToDelete?.name}"</span>? 
              Это действие нельзя отменить. Приложение будет удалено из каталога и пользователи больше не смогут его установить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить приложение
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
