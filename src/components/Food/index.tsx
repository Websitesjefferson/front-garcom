
import { FiEdit3, FiTrash } from 'react-icons/fi';
import styles from './style.module.scss';
import Image from 'next/image';


interface IFoodPlate {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  
}

interface IProps {
  food: IFoodPlate;
  handleDelete: (id: string) => {};
  handleEditFood: (food: IFoodPlate) => void;
}

const Food: React.FC<IProps> = ({
  food,
  handleDelete,
  handleEditFood,
}: IProps) => {





  function setEditingFood(): void {
    handleEditFood(food);
  }

  const Price = parseFloat(food.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <section className={styles.Container}>
      <header>
        
        <img src={food.banner} alt={food.name} />
      </header>
      <section className={styles.body}>
        <h2>{food.name}</h2>
        <p className={styles.description}>{food.description}</p>
        <strong className={styles.price}>
      {Price}
    </strong>
      </section>
      <section className={styles.footer}>
        <div className={styles.iconContainer}>
          <button
            type="button"
            className="icon"
            onClick={() => setEditingFood()}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

      </section>
    </section>
  );
};

export default Food;
