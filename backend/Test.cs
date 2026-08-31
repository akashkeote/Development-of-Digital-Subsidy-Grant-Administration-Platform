using System;
using System.Net.Sockets;
using System.Text;

class Program {
    static void Main(string[] args) {
        string[] regions = { "us-east-1", "us-east-2", "us-west-1", "us-west-2", "eu-west-1", "eu-west-2", "eu-west-3", "eu-central-1", "ap-south-1", "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ap-northeast-2", "sa-east-1", "ca-central-1" };
        foreach (var region in regions) {
            try {
                using (var client = new TcpClient()) {
                    var result = client.BeginConnect($"aws-0-{region}.pooler.supabase.com", 6543, null, null);
                    var success = result.AsyncWaitHandle.WaitOne(TimeSpan.FromSeconds(2));
                    if (success) {
                        Console.WriteLine($"Connected to aws-0-{region}");
                    }
                }
            } catch {}
        }
    }
}
