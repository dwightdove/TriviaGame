var questions;
var numCorrect = 0;
var currentQuestion = 0;
var timerNextQuestion;
var progressNextQuestion;
var intervalNextQuestion;

var TIMEOUT_QUESTION = 10000;
var TIMEOUT_NEXT_QUESTION = 3000;
var NUM_QUESTIONS = 5;
var MESSAGE_CORRECT = 'Correct!';
var MESSAGE_INCORRECT = 'Wrong!';
var MESSAGE_TIME_UP = "Time's Up!";

function handleButtonClick(button) {
	// cancel timer
	clearTimeout(timerNextQuestion);
	clearInterval(intervalNextQuestion);

	// show answer
	if (button.html() === questions[currentQuestion].correct_answer) {
		button.toggleClass('btn-success');
		$('#game-message').html(MESSAGE_CORRECT);
		numCorrect++;
	} else {
		button.toggleClass('btn-danger');
		$('.btn-answer').each(function() {
			var currentButton = $(this);
			if (currentButton.html() === questions[currentQuestion].correct_answer) {
				currentButton.toggleClass('btn-success');
			}
		});
		$('#game-message').html(MESSAGE_INCORRECT);
	}

	setTimeout(nextQuestion, TIMEOUT_NEXT_QUESTION);
}

function showAnswer() {
	$('.btn-answer').each(function() {
		var currentButton = $(this);
		if (currentButton.html() === questions[currentQuestion].correct_answer) {
			currentButton.toggleClass('btn-success');
		}
	});

	$('#game-message').html(MESSAGE_TIME_UP);

	setTimeout(nextQuestion, TIMEOUT_NEXT_QUESTION);
}

function nextQuestion() {
	currentQuestion++;
	loadQuestion(currentQuestion);
}

function showScore() {
	$('#number-correct').html(numCorrect);
	$('#number-incorrect').html(NUM_QUESTIONS - numCorrect);
	$('#number-questions').html(NUM_QUESTIONS);
	$('#row-score').show();
	$('#row-question').hide();
}

function loadQuestion(index) {
	if (index >= NUM_QUESTIONS) {
		showScore();
		return;
	}

	// set question text
	$('#question-text').html(questions[index].question);

	$('.btn-answer').each(function() {
		$(this)
			.removeClass('btn-success')
			.removeClass('btn-danger')
			.removeClass('disabled');
	});

	// set answers
	$('#answer-1').html(questions[index].answers[0]);
	$('#answer-2').html(questions[index].answers[1]);
	$('#answer-3').html(questions[index].answers[2]);
	$('#answer-4').html(questions[index].answers[3]);

	// clear message
	$('#game-message').html('');

	// start timers
	progressNextQuestion = 100;
	intervalNextQuestion = setInterval(updateProgressNextQuestion, 1000);
	timerNextQuestion = setTimeout(showAnswer, TIMEOUT_QUESTION);
}

function updateProgressNextQuestion() {
	progressNextQuestion-=10;
	var className = 'progress-bar';

	if (progressNextQuestion < 40) {
		className += ' progress-bar-danger';
	} else if (progressNextQuestion < 80) {
		className += ' progress-bar-warning';
	} else {
		className += ' progress-bar-success';
	}

	$('#progress-question')
		.attr('class', className)
		.css('width', progressNextQuestion + '%');

	if (progressNextQuestion < 10) {
		clearInterval(intervalNextQuestion);
	}
}

function resetGame() {
	// reset variables
	numCorrect = 0;
	currentQuestion = 0;

	// get new questions
	$.ajax({
		url: 'https://opentdb.com/api.php?amount=' + NUM_QUESTIONS + '&type=multiple',
		method: 'GET',
		success: function(response) {
			console.log(response);

			questions = response.results;
			console.log(questions);

			// modify questions
			for (i in questions) {
				var answers = [];
				for (j in questions[i].incorrect_answers) {
					answers.push(questions[i].incorrect_answers[j]);
				}
				answers.splice(Math.floor(Math.random() * 4), 0, questions[i].correct_answer);
				questions[i].answers = answers;
			}

			loadQuestion(currentQuestion);	

			// hide/show rows
			$('#row-start').hide();
			$('#row-score').hide();
			$('#row-question').show();

			//todo: start question timer
		},
		error: function(response) {
			console.log(response);
		}
	});
}

$(document).ready(function () {
	$('.btn-answer').on('click', function() {
		handleButtonClick($(this));
	});

	$('#btn-start').on('click', resetGame);

	$('#btn-reset').on('click', resetGame);
});