<?php


    //ini_set('display_errors', 'On');
    //error_reporting(E_ALL);

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: aplication/json; charset=utf-8');

    $jsonResult = array();
    
    $ini = parse_ini_file('config.ini');
    
    $link = mysqli_connect($ini['db_host'], $ini['db_user'], $ini['db_password'], $ini['db_name']);
    
    mysqli_query($link, "SET NAMES utf8");

    function get_results()
    {
     
        

        

    }



    if (
        isset($_POST['type']) && $_POST['type'] == 'SET'
    ) {
        if (
            isset($_POST['answers'])
        ) {

            $results = $_POST['answers'];

            $columns = implode(", ", array_keys($results));

            $values  = implode(", ", array_values($results));

            $sql = "INSERT INTO answers ($columns) VALUES ($values)";

            $set_poll = mysqli_query($link, $sql);

            mysqli_free_result($set_poll);

        };
    };

    $get_total = mysqli_query($link, "SELECT SUM(a1) s1, SUM(a2) s2, SUM(a3) s3 ,SUM(a4) s4, SUM(a5) s5, SUM(a6) s6, SUM(a7) s7, SUM(a8) s8, SUM(a9) s9, SUM(a10) s10, (SUM(a1) + SUM(a2) + SUM(a3) + SUM(a4) + SUM(a5) + SUM(a6) + SUM(a7) + SUM(a8) + SUM(a9) + SUM(a10)) total FROM answers");

    $total = array_map('intval', mysqli_fetch_assoc($get_total));

    $jsonResult = array_merge($jsonResult, $total);

    mysqli_free_result($get_total);

    echo json_encode($jsonResult);

?>
