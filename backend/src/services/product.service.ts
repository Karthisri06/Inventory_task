import { AppDataSource} from "../datasource";
import { Product } from "../entities/product";


const productRepo = AppDataSource.getRepository(Product)

export const getAllProducts = async() =>{
    return await productRepo.find()

};

export const addProduct = async(productData:Partial<Product>) =>{
     const newProduct = productRepo.create(productData)
     return await productRepo.save(newProduct)
};


export const updateProduct = async(id :number , productData:Partial<Product>)=>{
    await productRepo.update(id,productData)
    return await productRepo.findOneBy({id})
};


export const deleteProduct = async(id:number)=>{
    return await productRepo.delete(id)

};

export const productsCSV = async (products: Omit <Product,"id">[]) =>{
    return await Product.insertMany(products)
}