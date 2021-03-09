using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace UserManagementReact.Models
{
    public class User
    {
        public int UserId { get; set; }
        [XmlElement("Email")]
        public string Email { get; set; }
        [XmlElement("FirstName")]
        public string FirstName { get; set; }
        [XmlElement("LastName")]
        public string LastName { get; set; }
        [XmlElement("Password")]
        public string Password { get; set; }
        [XmlElement("Role")]
        public int Role { get; set; } = 10;
    }
    public class UserContext: DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }

        public DbSet<User> users { get; set; }
    }

    [XmlRoot("Users")]
    public class UserList
    {
        [XmlElement("User")]
        public List<User> UsersList { get; set; }
    }
}
