import {useLocation} from 'react-router-dom';

function CategoryPage() {
  const location = useLocation();
  return <div>{location.pathname.substring(1)}</div>;
}
export default CategoryPage;
