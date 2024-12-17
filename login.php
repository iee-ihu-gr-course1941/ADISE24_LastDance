<?php
session_start();
include "./database/dbconnect.php";

if(isset($_POST['uname']) && isset($_POST['pcode'])){
    function validate($data){
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    $uname = validate($_POST['uname']);
    $pcode = validate($_POST['pcode']);

    if(empty($uname)){
        header("Location: index.php?error=Username is required");
        exit();
    }
    else if(empty($pcode)){
        header("Location: index.php?error=Password is required");
        exit();
    }

    $sql = "SELECT * FROM authentication WHERE user_name='$uname' AND password='$pcode' ";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) === 1){
        $row = mysqli_fetch_assoc($result);
        if($row['user_name'] === $uname && $row['password'] === $pcode){
            echo "Logged in";
            $_SESSION['user_name'] = $row['user_name'];
            $_SESSION['name'] = $row['name'];
            $_SESSION['id'] = $row['id'];
            header("Location: rules.php");
            exit();
        }
        else{
            header("Location: index.php?error=Incorrect name or password");
            exit();
        }
    }
    else{
        header("Location: index.php?error=Incorrect name or password");
        exit();
    }
}
else {
    header("Location: index.php");
    exit();
}
?>