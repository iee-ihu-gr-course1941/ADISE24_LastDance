<!DOCTYPE html>
<html>
    <head>
        <title>LOGIN</title>
        <link rel="stylesheet" href="./assets/css/style.css">
    </head>
    <body>
        <div class="wrapper-index">
            <div class="text-index">
                <form action="login.php" method="post">
                    <h2><img src="./assets/images/Ataxx-logo.jpg" width="160px" height="160px" >
                    <br><br>
                    LOGIN
                    </h2>
                    <?php if(isset($_GET['error'])) { ?>
                        <p class="error"> <?php echo $_GET['error']; ?></p>
                    <?php } ?>
                    <label>Username</label>
                    <input type="text" name="uname" placeholder="Username"><br>
                    <label>Password</label>
                    <input type="text" name="pcode" placeholder="Password"><br>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    </body>
</html>