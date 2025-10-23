<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Book Management System</h1>
        </div>
        <div class="content">
            <h2>Hello, {{ $user->name }}!</h2>
            <p>Thank you for registering with our Book Management System.</p>
            <p>You now have access to:</p>
            <ul>
                <li>Browse thousands of books</li>
                <li>Manage your book collection</li>
                <li>Add, edit, and delete books</li>
                <li>Track book inventory and statistics</li>
            </ul>
            <p>Get started by exploring our collection!</p>
            <p>Best regards,<br>The Book Management Team</p>
        </div>
    </div>
</body>
</html>
