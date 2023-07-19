import { FiEdit3} from 'react-icons/fi';
import {AiOutlineDelete} from 'react-icons/ai'
import styles from './styles.module.scss';
interface Category {
  id: string;
  name: string;


}

interface IProps {
  category: Category;
  handDeleteCategory: (category: Category) => void
  handleEditCategory: (category: Category) => void;
}

const Category: React.FC<IProps> = ({
  category,
  handleEditCategory,
  handDeleteCategory
}: IProps) => {




  function setEditingCategory(): void {
    handleEditCategory(category);
  }

  function setDeleteCategory(): void {
    handDeleteCategory(category);
  }

  return (
      <div className={styles.div}>
      <button   onClick={() => setEditingCategory()}>
        <div className={styles.icon}>
          <FiEdit3 size={20} />
        </div>
        
      </button>

      <button   onClick={() => setDeleteCategory()}>
        <div className={styles.icon}>
          <AiOutlineDelete size={20} />
        </div>
        
      </button>
</div>
  );
};

export default Category;
