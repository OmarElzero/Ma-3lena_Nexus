import { useNavigate } from 'react-router-dom';
import { CategoriesGrid } from '../components/CategoriesGrid';

export function Categories() {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };

  return <CategoriesGrid onCategorySelect={handleCategorySelect} />;
}