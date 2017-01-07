var questions;
var numCorrect = 0;
var currentQuestion = 0;
var timerNewGame;
var timerNewQuestion;
var timerNextQuestion;

var TIMEOUT_QUESTION = 10000;
var TIMEOUT_NEW_GAME = 5000;
var TIMEOUT_NEXT_QUESTION = 3000;
var NUM_QUESTIONS = 5;

function handleButtonClick(button) {
	// cancel timer
	clearTimeout(timerNextQuestion);
	clearInterval(intervalNextQuestion);

	// show answer
	if (button.html() === questions[currentQuestion].correct_answer) {
		button.toggleClass('btn-success');
		numCorrect++;
	} else {
		button.toggleClass('btn-danger');
		$('.btn-answer').each(function() {
			var currentButton = $(this);
			if (currentButton.html() === questions[currentQuestion].correct_answer) {
				currentButton.toggleClass('btn-success');
			}
		});
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
	
	setTimeout(nextQuestion, TIMEOUT_NEXT_QUESTION);
}

function nextQuestion() {
	currentQuestion++;
	loadQuestion(currentQuestion);
}

function showScore() {
	$('#number-correct').html(numCorrect);
	$('#number-questions').html(NUM_QUESTIONS);
	$('#row-score').show();
	$('#row-question').hide();

	// start reset timer
	setTimeout(resetGame, TIMEOUT_NEW_GAME);
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

	// start timers
	progressNextQuestion = 100;
	intervalNextQuestion = setInterval(updateProgressNextQuestion, 1000);
	timerNextQuestion = setTimeout(showAnswer, TIMEOUT_QUESTION);
}

function updateProgressNextQuestion() {
	progressNextQuestion-=10;
	$('#progress-question').css('width', progressNextQuestion + '%');

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
});