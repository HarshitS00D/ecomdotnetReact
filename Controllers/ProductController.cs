using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using UserManagementReact.Models;

namespace UserManagementReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductContext productContext;

        public ProductController(ProductContext productContext)
        {
            this.productContext = productContext;
        }

        // GET: ProductController
        [HttpGet]
        public IActionResult Get()
        {
           return  Ok(productContext.products.FromSqlRaw("SELECT * from Products").ToArray());
        }

        // POST: ProductController/checkout
        [HttpPost]
        [Route("checkout")]
        public IActionResult Checkout([FromBody] Product[] products)
        {
            try
            {
                Dictionary<int, string> errorMessages = new Dictionary<int, string>();

                foreach (Product product in products)
                {
                    Product productInDb = productContext.products.FromSqlRaw($"SELECT * from Products WHERE ProductId='{product.ProductId}'").First();

                    if (product.Quantity > productInDb.Quantity)
                    {
                        string mssg = productInDb.Quantity == 0 ? "Out Of Stock": $"Quantity exceeds Total Quantity of {productInDb.Quantity}";
                        errorMessages.Add(product.ProductId,mssg);
                    }
                }

                if (errorMessages.Keys.ToArray().Length > 0)
                {
                    return StatusCode(500, errorMessages);
                }

                foreach (Product product in products)
                {
                    productContext.Database.ExecuteSqlRaw($"UPDATE Products SET Quantity=Quantity-'{product.Quantity}' WHERE ProductId='{product.ProductId}'");
                }

                return Ok();
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // POST: ProductController/add
        [HttpPost]
        [Route("add")]
        public IActionResult Add([FromBody] object values)
        {
            try
            {
                Product product = JsonConvert.DeserializeObject<Product>(values.ToString());

                productContext.Database.ExecuteSqlRaw($"INSERT INTO Products (ProductName,ProductDesc,Price,Quantity) VALUES('{product.ProductName}','{product.ProductDesc}','{product.Price}','{product.Quantity}')");
                return Ok(product);
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // GET: ProductController/5
        [HttpGet("{id}")]
        public ActionResult GetSingleProduct(int id)
        {
            try
            {
                return Ok(productContext.products.FromSqlRaw($"SELECT * from Products WHERE ProductId='{id}'").First());
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }

        }

        // POST: ProductController/5
        [HttpPost("{id}")]
        public ActionResult UpdateProduct([FromBody] object values, int id)
        {
            try
            {
                var product = JsonConvert.DeserializeObject<Product>(values.ToString());
                productContext.Database.ExecuteSqlRaw($"UPDATE Products SET ProductName='{product.ProductName}',ProductDesc='{product.ProductDesc}',Price='{product.Price}',Quantity='{product.Quantity}' WHERE ProductId='{id}'");
                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // DELETE: ProductController/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            try
            {
                return Ok(productContext.Database.ExecuteSqlRaw($"DELETE from Products WHERE ProductId='{id}'"));
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}
