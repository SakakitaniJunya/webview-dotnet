using System;
using System.Threading.Tasks;
using System.Windows;
using Microsoft.Web.WebView2.Core;

namespace WebView2Desktop
{
    public partial class MainWindow : Window
    {
        private const string ReactAppUrl = "http://localhost:3001";
        
        public MainWindow()
        {
            InitializeComponent();
            InitializeWebView();
        }

        private async void InitializeWebView()
        {
            try
            {
                StatusText.Text = "WebView2を初期化中...";
                await WebView.EnsureCoreWebView2Async();
                
                // セキュリティ設定
                WebView.CoreWebView2.Settings.IsGeneralAutofillEnabled = false;
                WebView.CoreWebView2.Settings.IsPasswordAutosaveEnabled = false;
                WebView.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false;
                
                StatusText.Text = "初期化完了";
            }
            catch (Exception ex)
            {
                StatusText.Text = $"初期化エラー: {ex.Message}";
                MessageBox.Show($"WebView2の初期化に失敗しました:\n{ex.Message}", "エラー", 
                               MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void NavigateButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                StatusText.Text = "Reactアプリに接続中...";
                await WebView.CoreWebView2.Navigate(ReactAppUrl);
            }
            catch (Exception ex)
            {
                StatusText.Text = $"ナビゲーションエラー: {ex.Message}";
                MessageBox.Show($"Reactアプリへの接続に失敗しました:\n{ex.Message}\n\n" +
                               "Reactアプリが起動していることを確認してください。", "エラー", 
                               MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private async void RefreshButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                StatusText.Text = "更新中...";
                await WebView.CoreWebView2.Reload();
            }
            catch (Exception ex)
            {
                StatusText.Text = $"更新エラー: {ex.Message}";
            }
        }

        private void WebView_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            if (e.IsSuccess)
            {
                StatusText.Text = "読み込み完了";
            }
            else
            {
                StatusText.Text = "読み込み失敗";
                MessageBox.Show("ページの読み込みに失敗しました。\n" +
                               "Reactアプリ (http://localhost:3000) が起動していることを確認してください。", 
                               "エラー", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }
    }
}
