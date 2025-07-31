using Grpc.Core;
using GrpcService;

namespace GrpcService.Services;

public class UserService : GrpcService.UserService.UserServiceBase
{
    private static readonly List<User> Users = new()
    {
        new User { Id = 1, Name = "田中太郎", Email = "tanaka@example.com", CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), IsActive = true },
        new User { Id = 2, Name = "佐藤花子", Email = "sato@example.com", CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), IsActive = true },
        new User { Id = 3, Name = "鈴木一郎", Email = "suzuki@example.com", CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), IsActive = false }
    };

    private readonly ILogger<UserService> _logger;

    public UserService(ILogger<UserService> logger)
    {
        _logger = logger;
    }

    public override Task<GetUsersResponse> GetUsers(GetUsersRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Getting all users");
        
        var response = new GetUsersResponse
        {
            Success = true,
            Message = "ユーザー一覧を取得しました"
        };
        
        response.Users.AddRange(Users);
        
        return Task.FromResult(response);
    }

    public override Task<GetUserResponse> GetUser(GetUserRequest request, ServerCallContext context)
    {
        _logger.LogInformation($"Getting user with ID: {request.Id}");
        
        var user = Users.FirstOrDefault(u => u.Id == request.Id);
        
        if (user == null)
        {
            return Task.FromResult(new GetUserResponse
            {
                Success = false,
                Message = $"ID:{request.Id}のユーザーが見つかりません"
            });
        }
        
        return Task.FromResult(new GetUserResponse
        {
            User = user,
            Success = true,
            Message = "ユーザーを取得しました"
        });
    }

    public override Task<CreateUserResponse> CreateUser(CreateUserRequest request, ServerCallContext context)
    {
        _logger.LogInformation($"Creating user: {request.Name}");
        
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return Task.FromResult(new CreateUserResponse
            {
                Success = false,
                Message = "名前とメールアドレスは必須です"
            });
        }
        
        var newUser = new User
        {
            Id = Users.Count > 0 ? Users.Max(u => u.Id) + 1 : 1,
            Name = request.Name,
            Email = request.Email,
            CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
            IsActive = true
        };
        
        Users.Add(newUser);
        
        return Task.FromResult(new CreateUserResponse
        {
            User = newUser,
            Success = true,
            Message = "ユーザーを作成しました"
        });
    }

    public override Task<UpdateUserResponse> UpdateUser(UpdateUserRequest request, ServerCallContext context)
    {
        _logger.LogInformation($"Updating user with ID: {request.Id}");
        
        var user = Users.FirstOrDefault(u => u.Id == request.Id);
        
        if (user == null)
        {
            return Task.FromResult(new UpdateUserResponse
            {
                Success = false,
                Message = $"ID:{request.Id}のユーザーが見つかりません"
            });
        }
        
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return Task.FromResult(new UpdateUserResponse
            {
                Success = false,
                Message = "名前とメールアドレスは必須です"
            });
        }
        
        user.Name = request.Name;
        user.Email = request.Email;
        
        return Task.FromResult(new UpdateUserResponse
        {
            User = user,
            Success = true,
            Message = "ユーザーを更新しました"
        });
    }

    public override Task<DeleteUserResponse> DeleteUser(DeleteUserRequest request, ServerCallContext context)
    {
        _logger.LogInformation($"Deleting user with ID: {request.Id}");
        
        var user = Users.FirstOrDefault(u => u.Id == request.Id);
        
        if (user == null)
        {
            return Task.FromResult(new DeleteUserResponse
            {
                Success = false,
                Message = $"ID:{request.Id}のユーザーが見つかりません"
            });
        }
        
        Users.Remove(user);
        
        return Task.FromResult(new DeleteUserResponse
        {
            Success = true,
            Message = "ユーザーを削除しました"
        });
    }
}