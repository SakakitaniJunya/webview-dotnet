using GrpcService.Services;

var builder = WebApplication.CreateBuilder(args);

// Kestrel設定でHTTP/1.1とHTTP/2両方をサポート
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5181, listenOptions =>
    {
        listenOptions.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1AndHttp2;
    });
});

// Add services to the container.
builder.Services.AddGrpc();

// CORS設定を追加（gRPC-Web用）
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding");
    });
});

var app = builder.Build();

// CORS設定を適用
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
app.UseGrpcWeb();

app.MapGrpcService<GreeterService>().EnableGrpcWeb();
app.MapGrpcService<UserService>().EnableGrpcWeb();

app.MapGet("/", () => "gRPC server is running. Use gRPC client to communicate.");

app.Run();
