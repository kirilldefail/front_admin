import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Upload, X, Search, Loader2, Check, Tag, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { SidePanel } from './side-panel';
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

interface AddApplicationFormProps {
  onCancel: () => void;
  editingApplication?: Application | null;
}

// Моковые данные из репозитория
const repositoryPackages = [
  { name: 'firefox', displayName: 'Firefox', version: '120.0', description: 'Свободный браузер от Mozilla', category: 'Браузеры', size: '65', osVersion: 'Debian 11+', license: 'MPL-2.0', website: 'https://www.mozilla.org/firefox/' },
  { name: 'code', displayName: 'Visual Studio Code', version: '1.85.0', description: 'Редактор кода от Microsoft', category: 'Разработка', size: '85', osVersion: 'Debian 11+', license: 'MIT', website: 'https://code.visualstudio.com/' },
  { name: 'gimp', displayName: 'GIMP', version: '2.10.36', description: 'Редактор растровой графики', category: 'Графика', size: '120', osVersion: 'Debian 10+', license: 'GPL-3.0', website: 'https://www.gimp.org/' },
  { name: 'blender', displayName: 'Blender', version: '4.0.0', description: '3D редактор и аниматор', category: 'Графика', size: '310', osVersion: 'Debian 11+', license: 'GPL-2.0', website: 'https://www.blender.org/' },
  { name: 'libreoffice', displayName: 'LibreOffice', version: '7.6.2', description: 'Офисный пакет', category: 'Офисные', size: '280', osVersion: 'Debian 10+', license: 'MPL-2.0', website: 'https://www.libreoffice.org/' },
];

// Моковые данные для тегов
const availableTags = [
  'Графика', 'Разработка', 'Web', 'IDE', 'Браузер', 'Open Source', 
  'Free', 'Офис', '3D', 'Дизайн', 'Редактор', 'Текст', 'Видео', 'Аудио'
];

// Моковые данные для аналогов
const availableAnalogs = [
  { name: 'Chrome', description: 'Браузер от Google' },
  { name: 'Chromium', description: 'Открытая версия Chrome' },
  { name: 'Photoshop', description: 'Редактор растровой графики' },
  { name: 'Inkscape', description: 'Векторный редактор' },
  { name: 'Sublime Text', description: 'Текстовый редактор' },
  { name: 'Atom', description: 'Текстовый редактор от GitHub' },
];

export function AddApplicationForm({ onCancel, editingApplication }: AddApplicationFormProps) {
  const isEditing = !!editingApplication;
  const [currentStep, setCurrentStep] = useState(isEditing ? 1 : 0); // 0 - поиск, 1 - основная информация, 2 - теги и аналоги, 3 - подтверждение
  const [tags, setTags] = useState<string[]>([]);
  const [analogs, setAnalogs] = useState<string[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  // Состояния для полей формы
  const [formData, setFormData] = useState({
    name: '',
    package: '',
    description: '',
    version: '',
    category: '',
    size: '',
    osVersion: '',
    website: '',
    license: '',
    changelog: ''
  });

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editingApplication) {
      setFormData({
        name: editingApplication.name,
        package: editingApplication.package,
        description: editingApplication.description,
        version: editingApplication.version,
        category: editingApplication.category,
        size: editingApplication.size,
        osVersion: editingApplication.osVersion,
        website: editingApplication.website || '',
        license: editingApplication.license || '',
        changelog: editingApplication.changelog || ''
      });
      setTags(editingApplication.tags || []);
      setAnalogs(editingApplication.analogs || []);
    }
  }, [editingApplication]);

  // Поиск в репозитории
  const [packageSearch, setPackageSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isRepoSheetOpen, setIsRepoSheetOpen] = useState(false);

  // Поиск тегов
  const [tagSearch, setTagSearch] = useState('');
  const [isTagSheetOpen, setIsTagSheetOpen] = useState(false);

  // Поиск аналогов
  const [analogSearch, setAnalogSearch] = useState('');
  const [isAnalogSheetOpen, setIsAnalogSheetOpen] = useState(false);

  const handleSearchRepository = () => {
    if (!packageSearch.trim()) {
      toast.error('Введите название пакета для поиска');
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const foundPackage = repositoryPackages.find(
        pkg => pkg.name.toLowerCase() === packageSearch.toLowerCase()
      );

      if (foundPackage) {
        setFormData({
          ...formData,
          name: foundPackage.displayName,
          package: foundPackage.name,
          description: foundPackage.description,
          version: foundPackage.version,
          category: foundPackage.category,
          size: foundPackage.size,
          osVersion: foundPackage.osVersion,
          website: foundPackage.website,
          license: foundPackage.license,
        });
        toast.success(`Пакет "${foundPackage.displayName}" найден и загружен!`);
        setIsRepoSheetOpen(false);
        setPackageSearch('');
      } else {
        toast.error('Пакет не найден в репозитории');
      }
      
      setIsSearching(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddAnalog = (analog: string) => {
    if (!analogs.includes(analog)) {
      setAnalogs([...analogs, analog]);
    }
  };

  const handleRemoveAnalog = (analog: string) => {
    setAnalogs(analogs.filter(a => a !== analog));
  };

  const isStep0Valid = formData.name && formData.package;
  const isStep1Valid = formData.name && formData.package && formData.version && formData.category && formData.description;

  const handleNextStep = () => {
    if (currentStep === 0) {
      // Валидация поискового шага
      if (!isStep0Valid) {
        toast.error('Выполните поиск и выберите пакет из репозитория');
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Валидация первого шага
      if (!isStep1Valid) {
        toast.error('Заполните все обязательные поля');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > (isEditing ? 1 : 0)) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSelectPackage = (pkg: typeof repositoryPackages[0]) => {
    setFormData({
      ...formData,
      name: pkg.displayName,
      package: pkg.name,
      description: pkg.description,
      version: pkg.version,
      category: pkg.category,
      size: pkg.size,
      osVersion: pkg.osVersion,
      website: pkg.website,
      license: pkg.license,
    });
    toast.success(`Пакет "${pkg.displayName}" загружен!`);
    setIsRepoSheetOpen(false);
  };

  const handleCancelClick = () => {
    // Проверяем, есть ли изменения в форме
    const hasChanges = formData.name || formData.package || tags.length > 0 || analogs.length > 0;
    if (hasChanges) {
      setCancelDialogOpen(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false);
    onCancel();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      toast.success('Приложение успешно обновлено!');
    } else {
      toast.success('Приложение успешно добавлено!');
    }
    setTimeout(() => onCancel(), 1500);
  };

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const filteredAnalogs = availableAnalogs.filter(analog =>
    analog.name.toLowerCase().includes(analogSearch.toLowerCase()) ||
    analog.description.toLowerCase().includes(analogSearch.toLowerCase())
  );

  const steps = isEditing 
    ? ['Основная информация', 'Теги и аналоги', 'Подтверждение']
    : ['Поиск в репозитории', 'Основная информация', 'Теги и аналоги', 'Подтверждение'];

  const displaySteps = isEditing ? steps : steps;
  const displayCurrentStep = isEditing ? currentStep - 1 : currentStep;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleCancelClick} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к списку
        </Button>
        <h2 className="text-2xl mb-2">{isEditing ? 'Редактировать приложение' : 'Добавить новое приложение'}</h2>
        <p className="text-gray-600">
          {isEditing ? 'Обновите информацию о приложении' : 'Заполните информацию о приложении для добавления в каталог'}
        </p>
      </div>

      {/* Text Stepper */}
      <div className="mb-8 border-b">
        <div className="flex items-center gap-8">
          {displaySteps.map((step, index) => {
            const actualIndex = isEditing ? index + 1 : index;
            return (
              <div key={index} className="relative pb-4">
                <button
                  type="button"
                  onClick={() => {
                    if (actualIndex < currentStep) {
                      setCurrentStep(actualIndex);
                    }
                  }}
                  disabled={actualIndex > currentStep}
                  className={`text-sm transition-colors ${
                    currentStep === actualIndex
                      ? 'text-green-600 font-medium' 
                      : actualIndex < currentStep
                      ? 'text-gray-600 hover:text-gray-900 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {step}
                </button>
                {currentStep === actualIndex && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Шаг 0: Поиск в репозитории */}
        {currentStep === 0 && !isEditing && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Поиск пакета в репозитории Debian</CardTitle>
                <CardDescription>Найдите пакет для автоматического заполнения данных</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center py-12">
                  <Button 
                    type="button" 
                    size="lg"
                    onClick={() => setIsRepoSheetOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Открыть поиск в репозитории
                  </Button>
                </div>

                {formData.name && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-3">Выбранный пакет:</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-green-900">{formData.name}</h3>
                          <p className="text-sm text-green-700 mt-1">{formData.description}</p>
                          <div className="flex gap-3 mt-2">
                            <span className="text-xs text-green-600">Пакет: {formData.package}</span>
                            <span className="text-xs text-green-600">Версия: {formData.version}</span>
                            <span className="text-xs text-green-600">Категория: {formData.category}</span>
                          </div>
                        </div>
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Шаг 1: Основная информация */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
                <CardDescription>Базовые данные о приложении</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название приложения *</Label>
                    <Input 
                      id="name" 
                      placeholder="Например: Visual Studio Code" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="package">Имя пакета *</Label>
                    <Input 
                      id="package" 
                      placeholder="Например: code" 
                      value={formData.package}
                      onChange={(e) => handleInputChange('package', e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Краткое описание приложения и его основных возможностей..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="version">Версия *</Label>
                    <Input 
                      id="version" 
                      placeholder="1.0.0" 
                      value={formData.version}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Категория *</Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Разработка">Разработка</SelectItem>
                        <SelectItem value="Браузеры">Браузеры</SelectItem>
                        <SelectItem value="Графика">Графика</SelectItem>
                        <SelectItem value="Офисные">Офисные</SelectItem>
                        <SelectItem value="Мультимедиа">Мультимедиа</SelectItem>
                        <SelectItem value="Утилиты">Утилиты</SelectItem>
                        <SelectItem value="Игры">Игры</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Размер (МБ)</Label>
                    <Input 
                      id="size" 
                      type="number" 
                      placeholder="85" 
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="osVersion">Версия ОС *</Label>
                    <Select
                      value={formData.osVersion}
                      onValueChange={(value) => handleInputChange('osVersion', value)}
                      required
                    >
                      <SelectTrigger id="osVersion">
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Debian 10+">Debian 10+</SelectItem>
                        <SelectItem value="Debian 11+">Debian 11+</SelectItem>
                        <SelectItem value="Debian 12+">Debian 12+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Иконка приложения</CardTitle>
                <CardDescription>Загрузите иконку для приложения</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Иконка приложения</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">Нажмите для загрузки или перетащите файл</p>
                    <p className="text-xs text-gray-400">PNG, JPG или SVG (рекомендуется 512x512px)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Дополнительная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input 
                      id="website" 
                      type="url" 
                      placeholder="https://example.com" 
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license">Лицензия</Label>
                    <Input 
                      id="license" 
                      placeholder="MIT, GPL-3.0, Apache-2.0" 
                      value={formData.license}
                      onChange={(e) => handleInputChange('license', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changelog">Журнал изменений</Label>
                  <Textarea 
                    id="changelog" 
                    placeholder="Что нового в этой версии..."
                    rows={3}
                    value={formData.changelog}
                    onChange={(e) => handleInputChange('changelog', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Шаг 2: Теги и аналоги */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Теги</CardTitle>
                    <CardDescription>Добавьте теги для лучшего поиска приложения</CardDescription>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsTagSheetOpen(true)}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Поиск тегов
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Добавить тег вручную</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Введите тег..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            handleAddTag(input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {tags.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Выбранные теги ({tags.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="default" className="pr-1 bg-green-600 hover:bg-green-700">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:bg-green-700 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Аналоги</CardTitle>
                    <CardDescription>Укажите похожие приложения</CardDescription>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAnalogSheetOpen(true)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Поиск аналогов
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Добавить аналог вручную</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Введите название приложения..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            handleAddAnalog(input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {analogs.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Выбранные аналоги ({analogs.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {analogs.map((analog) => (
                        <Badge key={analog} variant="secondary" className="pr-1">
                          <Copy className="w-3 h-3 mr-1" />
                          {analog}
                          <button
                            type="button"
                            onClick={() => handleRemoveAnalog(analog)}
                            className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Шаг 3: Подтверждение */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Подтверждение данных</CardTitle>
                <CardDescription>Проверьте введенную информацию перед {isEditing ? 'обновлением' : 'добавлением'} приложения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Основная информация</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">Название приложения</TableCell>
                        <TableCell>{formData.name || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Имя пакета</TableCell>
                        <TableCell>{formData.package || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Описание</TableCell>
                        <TableCell>{formData.description || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Версия</TableCell>
                        <TableCell>{formData.version || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Категория</TableCell>
                        <TableCell>{formData.category || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Размер</TableCell>
                        <TableCell>{formData.size ? `${formData.size} МБ` : '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Версия ОС</TableCell>
                        <TableCell>{formData.osVersion || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-3">Дополнительная информация</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">Веб-сайт</TableCell>
                        <TableCell>{formData.website || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Лицензия</TableCell>
                        <TableCell>{formData.license || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Журнал изменений</TableCell>
                        <TableCell>{formData.changelog || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-3">Теги и аналоги</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">Теги</TableCell>
                        <TableCell>
                          {tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {tags.map(tag => (
                                <Badge key={tag} variant="default" className="bg-green-600">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Аналоги</TableCell>
                        <TableCell>
                          {analogs.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {analogs.map(analog => (
                                <Badge key={analog} variant="secondary">
                                  <Copy className="w-3 h-3 mr-1" />
                                  {analog}
                                </Badge>
                              ))}
                            </div>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Навигация */}
        <div className="flex justify-between pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={currentStep === (isEditing ? 1 : 0) ? handleCancelClick : handlePrevStep}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === (isEditing ? 1 : 0) ? 'Отмена' : 'Назад'}
          </Button>
          
          {currentStep < 3 ? (
            <Button 
              type="button" 
              onClick={handleNextStep}
              disabled={
                (currentStep === 0 && !isStep0Valid) ||
                (currentStep === 1 && !isStep1Valid)
              }
              className={
                ((currentStep === 0 && !isStep0Valid) ||
                (currentStep === 1 && !isStep1Valid))
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              Далее
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {isEditing ? 'Обновить приложение' : 'Добавить приложение'}
            </Button>
          )}
        </div>
      </form>

      {/* Repository Search Side Panel */}
      <SidePanel
        open={isRepoSheetOpen}
        onOpenChange={setIsRepoSheetOpen}
        title="Поиск в репозитории Debian"
        description="Найдите пакет для автоматического заполнения данных"
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label>Название пакета</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Введите имя пакета..."
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchRepository())}
                />
                <Button 
                  type="button"
                  onClick={handleSearchRepository}
                  disabled={isSearching}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Поиск
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Найти
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <Separator className="mb-4" />
          <div>
            <h3 className="text-sm font-semibold mb-3">Доступные пакеты</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Пакет</TableHead>
                    <TableHead>Версия</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead className="text-right">Действие</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repositoryPackages.filter(pkg => 
                    !packageSearch || 
                    pkg.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
                    pkg.displayName.toLowerCase().includes(packageSearch.toLowerCase())
                  ).map(pkg => (
                    <TableRow key={pkg.name} className="cursor-pointer hover:bg-gray-50" onClick={() => handleSelectPackage(pkg)}>
                      <TableCell className="font-medium">{pkg.displayName}</TableCell>
                      <TableCell className="font-mono text-sm">{pkg.name}</TableCell>
                      <TableCell>{pkg.version}</TableCell>
                      <TableCell>{pkg.category}</TableCell>
                      <TableCell>{pkg.size} МБ</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPackage(pkg);
                          }}
                        >
                          Выбрать
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SidePanel>

      {/* Tags Search Side Panel */}
      <SidePanel
        open={isTagSheetOpen}
        onOpenChange={setIsTagSheetOpen}
        title="Поиск тегов"
        description="Выберите теги из списка или найдите нужный"
      >
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label>Поиск</Label>
              <Input
                placeholder="Введите название тега..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
              />
            </div>
          </div>
          <Separator className="mb-4" />
          <div>
            <h3 className="text-sm font-semibold mb-3">Доступные теги ({filteredTags.length})</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Тег</TableHead>
                    <TableHead className="text-right">Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.map(tag => (
                    <TableRow 
                      key={tag} 
                      className={`cursor-pointer hover:bg-gray-50 ${tags.includes(tag) ? 'bg-green-50' : ''}`}
                      onClick={() => {
                        if (tags.includes(tag)) {
                          handleRemoveTag(tag);
                        } else {
                          handleAddTag(tag);
                        }
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span>{tag}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {tags.includes(tag) ? (
                          <Badge variant="default" className="bg-green-600">
                            <Check className="w-3 h-3 mr-1" />
                            Выбран
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddTag(tag);
                            }}
                          >
                            Добавить
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SidePanel>

      {/* Analogs Search Side Panel */}
      <SidePanel
        open={isAnalogSheetOpen}
        onOpenChange={setIsAnalogSheetOpen}
        title="Поиск аналогов"
        description="Выберите похожие приложения из списка"
        size="md"
      >
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label>Поиск</Label>
              <Input
                placeholder="Введите название приложения..."
                value={analogSearch}
                onChange={(e) => setAnalogSearch(e.target.value)}
              />
            </div>
          </div>
          <Separator className="mb-4" />
          <div>
            <h3 className="text-sm font-semibold mb-3">Доступные приложения ({filteredAnalogs.length})</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead className="text-right">Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalogs.map(analog => (
                    <TableRow 
                      key={analog.name}
                      className={`cursor-pointer hover:bg-gray-50 ${analogs.includes(analog.name) ? 'bg-green-50' : ''}`}
                      onClick={() => {
                        if (analogs.includes(analog.name)) {
                          handleRemoveAnalog(analog.name);
                        } else {
                          handleAddAnalog(analog.name);
                        }
                      }}
                    >
                      <TableCell className="font-medium">{analog.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{analog.description}</TableCell>
                      <TableCell className="text-right">
                        {analogs.includes(analog.name) ? (
                          <Badge variant="default" className="bg-green-600">
                            <Check className="w-3 h-3 mr-1" />
                            Выбран
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddAnalog(analog.name);
                            }}
                          >
                            Добавить
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SidePanel>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить {isEditing ? 'редактирование' : 'добавление'}?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить {isEditing ? 'редактирование' : 'добавление'} приложения? 
              Все несохраненные изменения будут потеряны.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Продолжить {isEditing ? 'редактирование' : 'добавление'}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Отменить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
