import { useState, useEffect, useContext} from 'react'
import Head from 'next/head';
import { Header } from '../../components/Header'
import Food from '../../components/Food';
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'
import Modal from 'react-modal';
import { ModalProduct } from '../../components/ModalProduct'
import { ModalCategory } from '../../components/ModalCategory'
import { AuthContext } from '../../contexts/AuthContext'
import Category from '../../components/Category';
import { CircularProgress } from '@mui/material';
import { ModalDeleteCategory } from '../../components/ModalDeleteCategory';
import { canSSRAuth } from '../../utils/canSSRAuth'

type ProductProps = {
  id: string;
  price: string;
  name: string;
  description: string
  banner: string
}
type CategoryProps = {
  id: string;
  name: string;

}



export default function GetItem() {

  const apiClient = setupAPIClient();
  const { userId } = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductProps>({} as ProductProps)
  const [editingCategory, setEditingCategory] = useState<CategoryProps>({} as CategoryProps)
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [categories, setCategories] = useState([])
  
  const [banner, setBanner] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')


  const [categoryVisibleDelete, setCategoryVisibleDelete] = useState(false)
  
  
  useEffect(() => {

    async function Products() {
      setLoading(true)
      const response = await apiClient.get('/category/product', {
        params: {
           company_id: userId
        }
        
      })
    
      setProducts(response.data);
      setLoading(false)
    }
      Products()
      SearchCategory()
      
}, [userId])
  async function SearchCategory() {
     const response = await apiClient.get('/category', {
      params: {
        company_id: userId
      }
     })
     setCategories(response.data)
     
  }

  function handleCloseModal() {

    setModalVisible(false);
  }

  function handleCategoryCloseModal() {

    setCategoryVisible(false);
  }

  function handleCategoryCloseModalDelete() {

    setCategoryVisibleDelete(false);
  }
  const data = new FormData();

 
  async function handleFinishEditProduct(id: string) {

    data.append('name', name);
    data.append('price', price);
    data.append('description', description);
    data.append('item_id', id)
    data.append('file', banner);
  
  const apiClient = setupAPIClient();
  const response = await apiClient.put('/product/update', data)
   
    const ProductIndex = products.findIndex(f => f.id === editingProduct.id);

    const newProduct = [...products];
    newProduct[ProductIndex] = response.data;
     
    setProducts(newProduct)
    setModalVisible(false);
    toast.success('Atualizado com sucesso!')
    
  }
  async function handleFinishEditCategory(id: string) {
    const apiClient = setupAPIClient();
    await apiClient.put('/category/update', {
      id: id,
      name: category

    })

    SearchCategory()
    setCategoryVisible(false);
    toast.success('Atualizado com sucesso!')

  }
  async function searchProducts(id: ProductProps) {
    setLoading(true)
    const response = await apiClient.get('/category/product', {
      params: {
        category_id: id,
        company_id: userId
      }
      
    })
  
    setProducts(response.data);
    setLoading(false)
  }
  async function deleteItem(id: string) {
   try  {
    await apiClient.delete('/product/delete', {
      params: {
        id: id
      }
    })
    setProducts(products.filter(food => food.id !== id));
    return toast.success('Deletado com sucesso!')
  } catch(err){
    toast.error("Conclua todas as ordens para apagar um Produto!")
    
  }
  }
  async function deleteCategory(id: string) {
    try  {
     await apiClient.delete('/category/delete', {
       params: {
        item_id: id
       }
     })
     setCategories(categories.filter(food => food.id !== id));
     setCategoryVisibleDelete(false);
     return toast.success('Deletado com sucesso!')
   } catch(err){
     toast.error("Conclua todas as ordens para apagar um Produto!")
     
   }
   }

  async function handleOpenModalView(food: ProductProps) {
    setEditingProduct(food);
    setModalVisible(true);
    setName(food.name)
    setBanner(food.banner)
    setDescription(food.description)
    setPrice(food.price)

  }

  function handleOpenModalViewCategory(category: CategoryProps) {
    setEditingCategory(category)
    setCategoryVisible(true)
    setCategory(category.name)
  }

  function handleOpenModalViewCategoryDelete(category: CategoryProps) {
    setEditingCategory(category)
    setCategoryVisibleDelete(true)
    
  }


  Modal.setAppElement('#__next');
  return (
    <>
      <Head>
        <title>Produtos cadastrados</title>
      </Head>
      <Header />
      <div className={styles.Div}>
        <div className={styles.Container} >
          <div className={styles.Card} >

          
          {
          categories.length === 0 && (
            <span className={styles.text}>
               Nenhuma categoria cadastrada...
            </span>
          )}
            
            { categories && 
              categories.map((item) => {
                return (
                  <div className={styles.article} key={item.id}>
                    <button onClick={() => searchProducts(item.id)}>
                      {item.name}
                    </button>
                   <Category
                      category={item}
                      handleEditCategory={handleOpenModalViewCategory}
                      handDeleteCategory={handleOpenModalViewCategoryDelete}
                    />

         
                  </div>
                )

              })
            }
          </div>
        </div>

        <div className={styles.FoodsContainer} >
          <div className={styles.CardProduct} >
            { 
            loading ?  <CircularProgress style={{marginTop: 50}}/> 
            :
            products.map(product => (
                <Food
                  key={product.id}
                  food={product}
                  handleDelete={deleteItem}
                  handleEditFood={handleOpenModalView}
                />
              ))
           }
          </div>
        </div>
        {categoryVisible && (


          <ModalCategory

            isOpen={categoryVisible}
            onRequestClose={handleCategoryCloseModal}
            handleFinishOrder={handleFinishEditCategory}
            categories={editingCategory}
            category={category}
            setCategory={setCategory}



          />

        )}


        {modalVisible && (


          <ModalProduct

            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            handleFinishOrder={handleFinishEditProduct}
            product={editingProduct}
            name={name}
            banner={banner}
            setBanner={setBanner}
            description={description}
            price={price}
            setName={setName}
            setPrice={setPrice}
            setDescription={setDescription}

          />

        )}

        {
           categoryVisibleDelete && (

            <ModalDeleteCategory 
            isOpen={categoryVisibleDelete}
            onRequestClose={handleCategoryCloseModalDelete}
            categories={editingCategory}
            handleFinishCategory={deleteCategory}/>
           )
        }
      </div>



    </>
  )
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apliClient = setupAPIClient(ctx)

  const response = await apliClient.get('/category', {
     
  });
  //console.log(response.data);

  return {
    props: {
      categoryList: response.data
    }
  }
})
