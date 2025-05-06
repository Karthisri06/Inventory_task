import { Request, Response } from "express";
import * as productService from "../services/product.service";
import multer from "multer";
import csvParser from "csv-parser";  
import fs from "fs";  
import { Product } from "../entities/product";
import { AppDataSource } from "../datasource";

const upload = multer({ dest: "uploads/" });
const productRepo = AppDataSource.getRepository(Product);

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

export const addProduct = async (req: Request, res: Response) => {
  const product = await productService.addProduct(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await productService.updateProduct(Number(id), req.body);
  res.json(updated);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await productService.deleteProduct(Number(id));
  res.json({ message: "Product deleted" });
};

export const uploadCSV = [
  upload.single("csv"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded." });
        return;
      }

      const products: Omit<Product, "id" | "created_at" | "updated_at">[] = [];

      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (row: {
          name: string;
          category: string;
          sku: string;
          price: string;
          quantity: string;
          brand?: string;
          image_url?: string | undefined;
        }) => {
          const price = parseFloat(row.price);
          const quantity = parseInt(row.quantity);

          if (isNaN(price) || isNaN(quantity) || !row.name || !row.category || !row.sku) {
            console.error("Invalid row skipped:", row);
            return;
          }

          const brand = row.brand || "";  

          const image_url = row.image_url || "";  
        
          const product = {
            name: row.name,
            category: row.category,
            sku: row.sku,
            price,
            quantity,
            brand, 
            image_url,  
          };

          products.push(product);
        })
        .on("end", async () => {
          if (products.length > 0) {
            await productRepo.save(products);
            res.status(201).json({ message: "Products uploaded successfully!" });
          } else {
            res.status(400).json({ message: "No valid data found in CSV." });
          }
        })
        .on("error", (error: any) => {
          console.error("Error parsing CSV:", error);
          res.status(500).json({ message: "Error parsing CSV file." });
        });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Server error." });
    }
  },
];
