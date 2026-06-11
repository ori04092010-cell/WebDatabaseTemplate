using System;
using System.Linq;
using System.Text.Json.Serialization;
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
            Console.WriteLine($"Received request: {request.Name}");

            try
            {
                // -------------------------
                //  USER SYSTEM
                // -------------------------

                if (request.Name == "getUser")
                {
                    var token = request.GetParams<string>();
                    var user = database.Users.FirstOrDefault(u => u.Token == token);
                    request.Respond(user);
                }

                else if (request.Name == "signUp")
                {
                    var (username, password) = request.GetParams<(string, string)>();

                    if (database.Users.Any(u => u.Username == username))
                    {
                        request.Respond<string?>(null);
                        continue;
                    }

                    var token = Guid.NewGuid().ToString();
                    var user = new User(token, username, password);
                    database.Users.Add(user);
                    database.SaveChanges();

                    request.Respond(token);
                }

                else if (request.Name == "logIn")
                {
                    var (username, password) = request.GetParams<(string, string)>();
                    var user = database.Users.FirstOrDefault(u =>
                        u.Username == username &&
                        u.Password == password);

                    request.Respond(user?.Token);
                }

                // -------------------------
                //  COOKIE CLICKER GAME
                // -------------------------

                else if (request.Name == "getGameState")
                {
                    var token = request.GetParams<string>();
                    var user = database.Users.FirstOrDefault(u => u.Token == token);

                    if (user == null)
                    {
                        request.Respond<object?>(null);
                        continue;
                    }

                    request.Respond(new { user.Cookies, user.Cursors,user.Multiplier });
                }

                else if (request.Name == "saveGameState")
                {
                    var (token, cookies, cursors,Multiplier) = request.GetParams<(string, int, int,int)>();
                    var user = database.Users.FirstOrDefault(u => u.Token == token);

                    if (user != null)
                    {
                        user.Cookies = cookies;
                        user.Cursors = cursors;
                        user.Multiplier = Multiplier;
                        database.SaveChanges();
                    }

                    request.Respond(true);
                }

                // -------------------------
                //  UNKNOWN REQUEST
                // -------------------------

                else
                {
                    request.SetStatusCode(400);
                }
            }
            catch (Exception ex)
            {
                request.SetStatusCode(500);
                Log.WriteException(ex);
            }
        }
    }
}

// -------------------------
//  DATABASE
// -------------------------

class Database() : DatabaseCore("database")
{
    public DbSet<User> Users { get; set; } = default!;
}

// -------------------------
//  USER MODEL (EF SAFE)
// -------------------------

class User
{
    public int Id { get; set; }

    [JsonIgnore]
    public string Token { get; set; } = "";

    public string Username { get; set; } = "";

    [JsonIgnore]
    public string Password { get; set; } = "";

    public int Cookies { get; set; }
    public int Cursors { get; set; }

    public int Multiplier {get; set;}

    public User() {}

    public User(string token, string username, string password)
    {
        Token = token;
        Username = username;
        Password = password;
        Cookies = 0;
        Cursors = 0;
        Multiplier = 1;
    }
}
