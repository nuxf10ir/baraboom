<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: aplication/json; charset=utf-8');



    //error_reporting(E_ALL);
    //ini_set('display_errors', 1);


    $ini = parse_ini_file('config.ini');

    $link = mysqli_connect($ini['db_host'], $ini['db_user'], $ini['db_password'], $ini['db_name']);

    mysqli_query($link, "SET NAMES utf8");



    $jsonResult = array();

    $get_poll = mysqli_query($link, "SELECT id as pollId, poll_pre as pollPre, poll_title as pollTitle, poll_question as pollQuestion, poll_sub as pollSub FROM polls WHERE is_active = 1 LIMIT 1");
      
    
    $current_poll = mysqli_fetch_assoc($get_poll);

    $jsonResult = array_merge($jsonResult, $current_poll);

    $currentPollId = $jsonResult["pollId"];


    
    $get_questions = mysqli_query($link, "SELECT id as answerId, answer_text as answerText FROM answers WHERE poll_id = $currentPollId");

    while ($variant = mysqli_fetch_array($get_questions, MYSQLI_ASSOC)) {
      $jsonResult["variants"][] = $variant; 
    }


    mysqli_free_result($get_poll);

    mysqli_free_result($get_questions);


    echo json_encode($jsonResult);
    

?>
