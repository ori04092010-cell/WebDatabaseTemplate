using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Project.DatabaseUtilities;
using Project.LoggingUtilities;
using Project.ServerUtilities;

class Program
{
    static void Main()
    {
        int port = 5000;

        var server = new Server(port);
        var database = new Database();

        Console.WriteLine("The server is running");
        Console.WriteLine($"Local:   http://localhost:{port}/website/pages/index.html");
        Console.WriteLine($"Network: http://{Network.GetLocalNetworkIPAddress()}:{port}/website/pages/index.html");

        while (true)
        {
            var request = server.WaitForRequest();
            Console.WriteLine($"Received a request: {request.Name}");

            try
            {
                if (request.Name == "signUp")
                {
                    var (username, password) = request.GetParams<(string, string)>();

                    if (database.Users.Any(u => u.Username == username))
                    {
                        request.Respond<string?>(null);
                        continue;
                    }

                    var token = Guid.NewGuid().ToString();

                    var user = new User
                    {
                        Username = username,
                        Password = password,
                        Token = token,
                        Cookies = 0,
                        Cursors = 0,
                        Achievements = 0
                    };

                    database.Users.Add(user);
                    database.SaveChanges();

                    request.Respond(token);
                }
                else if (request.Name == "logIn")
                {
                    var (username, password) = request.GetParams<(string, string)>();

                    var user = database.Users.FirstOrDefault(u =>
                        u.Username == username && u.Password == password);

                    if (user == null)
                    {
                        request.Respond<string?>(null);
                        continue;
                    }

                    user.Token = Guid.NewGuid().ToString();
                    database.SaveChanges();

                    request.Respond(user.Token);
                }
                else if (request.Name == "getUser")
                {
                    var token = request.GetParams<string>();
                    var user = database.Users.FirstOrDefault(u => u.Token == token);
                    request.Respond(user);
                }
                else if (request.Name == "saveGame")
                {
                    var (token, cookies, cursors, achievements) =
                        request.GetParams<(string, int, int, int)>();

                    var user = database.Users.FirstOrDefault(u => u.Token == token);

                    if (user != null)
                    {
                        user.Cookies = cookies;
                        user.Cursors = cursors;
                        user.Achievements = achievements;
                        database.SaveChanges();
                    }

                    request.Respond(true);
                }
            }
            catch (Exception exception)
            {
                request.SetStatusCode(500);
                Log.WriteException(exception);
            }
        }
    }
}

class Database() : DatabaseCore("database")
{
    public DbSet<User> Users { get; set; } = default!;
}

class User
{
    public int Id { get; set; }

    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string Token { get; set; } = "";

    public int Cookies { get; set; } = 0;
    public int Cursors { get; set; } = 0;
    public int Achievements { get; set; } = 0;
}
