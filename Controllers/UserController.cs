using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.CompilerServices;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using UserManagementReact.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UserManagementReact
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserContext userContext;
        public UserController(UserContext userContext)
        {
            this.userContext = userContext;
        }

        // GET: api/<UserController>
        [HttpGet]
        public IActionResult Get()
        {
            var result = userContext.users.FromSqlRaw("Select * from Users");
            return Ok(result);
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
           User[] user = userContext.users.FromSqlRaw($"SELECT * from Users WHERE UserId='{id}'").ToArray();

            return Ok(user[0]);  
        }

       
        // POST api/<UserController>/login
        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] object values)
        {
            try
            {
                var user = JsonConvert.DeserializeObject<User>(values.ToString());
                User[] users = userContext.users.FromSqlRaw($"SELECT * from Users WHERE email='{user.Email}' and password='{user.Password}'").ToArray();

                if (users.Length > 0) return Ok(new {users[0].UserId,users[0].Email,users[0].FirstName,users[0].LastName,users[0].Role});

                return NotFound();
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // POST api/<UserController>/upload
        [HttpPost]
        [Route("upload")]
        public IActionResult upload([FromForm] IFormCollection data)
        {
            try
            {
                IFormFile XmlFormFile = data.Files[0];
                
                var reader = XmlReader.Create(XmlFormFile.OpenReadStream());
                
                XmlSerializer serializer = new XmlSerializer(typeof(UserList));
                var list = ((UserList)serializer.Deserialize(reader)).UsersList;
     
                foreach (User user in list)
                {
                    try
                    {
                        User[] users = userContext.users.FromSqlRaw($"SELECT * from Users WHERE email='{user.Email}'").ToArray();

                        if (users.Length > 0)
                        {
                            continue;
                        }

                        userContext.Database.ExecuteSqlRaw($"INSERT INTO Users (Email,FirstName,LastName,Password) Values('{user.Email}','{user.FirstName}','{user.LastName}','{user.Password}')");
                    }
                    catch (Exception e)
                    {
                        Debug.WriteLine(e.Message);
                    }
                }

                return Ok();
            }
            
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
                return StatusCode(500,(new { error = e.Message }));
            }
        }

        // POST api/<UsersController>
        [HttpPost]
        public IActionResult Post([FromBody] object values)
        {
            try
            {
                User user = JsonConvert.DeserializeObject<User>(values.ToString());

                User[] users = userContext.users.FromSqlRaw($"SELECT * from Users WHERE email='{user.Email}'").ToArray();

                if(users.Length > 0)
                {
                    return StatusCode(409, "Email already registered.");
                }

                userContext.Database.ExecuteSqlRaw($"INSERT INTO Users (Email,FirstName,LastName,Password) Values('{user.Email}','{user.FirstName}','{user.LastName}','{user.Password}')");
                return Ok(user);
            }
            catch (Exception e)
            {
                return StatusCode(500,e.Message);
            }
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public IActionResult Put([FromBody] object values, int id)
        {
            try
            {
                var user = JsonConvert.DeserializeObject<User>(values.ToString());
                userContext.Database.ExecuteSqlRaw($"UPDATE Users SET Email='{user.Email}', FirstName='{user.FirstName}', LastName='{user.LastName}', Password='{user.Password}' WHERE UserId='{id}'");
                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            userContext.Database.ExecuteSqlRaw($"DELETE from Users WHERE UserId='{id}'");
            return Ok();
        }
    }
}
