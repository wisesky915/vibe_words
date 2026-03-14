function WordQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.questions = [];
    this.selectedAnswer = null;
    this.isAnswered = false;
    
    this.initializeElements();
    this.bindEvents();
    this.loadScores();
}

WordQuiz.prototype.initializeElements = function() {
    // 요소가 존재하는지 확인하는 헬퍼 함수
    function getElement(id) {
        var element = document.getElementById(id);
        if (!element) {
            console.warn('Element with id "' + id + '" not found');
        }
        return element;
    }

    // 화면 요소
    this.screens = {
        start: getElement('startScreen'),
        quiz: getElement('quizScreen'),
        result: getElement('resultScreen'),
        scores: getElement('scoresScreen')
    };

    // 퀴즈 요소
    this.quizElements = {
        currentQuestion: getElement('currentQuestion'),
        totalQuestions: getElement('totalQuestions'),
        currentScore: getElement('currentScore'),
        currentWord: getElement('currentWord'),
        optionsGrid: getElement('optionsGrid'),
        progressFill: getElement('progressFill'),
        prevBtn: getElement('prevBtn'),
        nextBtn: getElement('nextBtn')
    };

    // 결과 요소
    this.resultElements = {
        finalScore: getElement('finalScore'),
        scoreMessage: getElement('scoreMessage')
    };

    // 점수 요소
    this.scoresElements = {
        scoresList: getElement('scoresList')
    };

    // 버튼
    this.buttons = {
        startQuiz: getElement('startQuizBtn'),
        viewScores: getElement('viewScoresBtn'),
        retry: getElement('retryBtn'),
        viewScores2: getElement('viewScoresBtn2'),
        clearScores: getElement('clearScoresBtn'),
        backToStart: getElement('backToStartBtn')
    };

    // 로딩
    this.loadingOverlay = getElement('loadingOverlay');
}

WordQuiz.prototype.bindEvents = function() {
    var self = this;
    
    // 버튼이 존재하는지 확인 후 이벤트 바인딩
    if (this.buttons.startQuiz) {
        this.buttons.startQuiz.addEventListener('click', function() {
            self.startQuiz();
        });
    }
    
    // 시작 화면의 학습 시작 버튼도 연결
    var startQuizBtn2 = document.getElementById('startQuizBtn2');
    if (startQuizBtn2) {
        startQuizBtn2.addEventListener('click', function() {
            self.startQuiz();
        });
    }
    
    if (this.buttons.viewScores) {
        this.buttons.viewScores.addEventListener('click', function() {
            self.showScores();
        });
    }
    
    if (this.buttons.retry) {
        this.buttons.retry.addEventListener('click', function() {
            self.startQuiz();
        });
    }
    
    if (this.buttons.viewScores2) {
        this.buttons.viewScores2.addEventListener('click', function() {
            self.showScores();
        });
    }
    
    if (this.buttons.clearScores) {
        this.buttons.clearScores.addEventListener('click', function() {
            self.clearScores();
        });
    }
    
    if (this.buttons.backToStart) {
        this.buttons.backToStart.addEventListener('click', function() {
            self.showStartScreen();
        });
    }
    
    if (this.quizElements.prevBtn) {
        this.quizElements.prevBtn.addEventListener('click', function() {
            self.previousQuestion();
        });
    }
    
    if (this.quizElements.nextBtn) {
        this.quizElements.nextBtn.addEventListener('click', function() {
            self.nextQuestion();
        });
    }
}

WordQuiz.prototype.showScreen = function(screenName) {
    Object.values(this.screens).forEach(function(screen) {
        if (screen) screen.classList.remove('active');
    });
    if (this.screens[screenName]) {
        this.screens[screenName].classList.add('active');
    }
}

WordQuiz.prototype.showLoading = function() {
    if (this.loadingOverlay) {
        this.loadingOverlay.classList.add('active');
    }
}

WordQuiz.prototype.hideLoading = function() {
    if (this.loadingOverlay) {
        this.loadingOverlay.classList.remove('active');
    }
}

WordQuiz.prototype.startQuiz = function() {
    var self = this;
    this.showLoading();
    
    setTimeout(function() {
        self.generateQuestions();
        self.currentQuestionIndex = 0;
        self.score = 0;
        self.selectedAnswer = null;
        self.isAnswered = false;
        
        self.showScreen('quiz');
        self.displayQuestion();
        self.hideLoading();
    }, 500);
}

WordQuiz.prototype.generateQuestions = function() {
    // 단어 데이터에서 랜덤으로 10개 선택
    var shuffled = wordsData.slice().sort(function() { return Math.random() - 0.5; });
    var selectedWords = shuffled.slice(0, 10);
    
    this.questions = selectedWords.map(function(wordData) {
        // 정답 의미와 다른 의미들로 보기 생성
        var otherMeanings = wordsData
            .filter(function(w) { return w.word !== wordData.word; })
            .map(function(w) { return w.meaning; });
        
        // 랜덤으로 3개의 다른 의미 선택
        var shuffledOthers = otherMeanings.slice().sort(function() { return Math.random() - 0.5; });
        var wrongOptions = shuffledOthers.slice(0, 3);
        
        // 정답과 오답을 섞어서 4지선다 만들기
        var allOptions = [wordData.meaning].concat(wrongOptions).sort(function() { return Math.random() - 0.5; });
        
        return {
            word: wordData.word,
            correctAnswer: wordData.meaning,
            options: allOptions
        };
    });
}

WordQuiz.prototype.displayQuestion = function() {
    var question = this.questions[this.currentQuestionIndex];
    
    if (!question) return;
    
    // 질문 정보 업데이트
    if (this.quizElements.currentQuestion) {
        this.quizElements.currentQuestion.textContent = this.currentQuestionIndex + 1;
    }
    if (this.quizElements.totalQuestions) {
        this.quizElements.totalQuestions.textContent = this.questions.length;
    }
    if (this.quizElements.currentScore) {
        this.quizElements.currentScore.textContent = this.score;
    }
    if (this.quizElements.currentWord) {
        this.quizElements.currentWord.textContent = question.word;
    }
    
    // 진행률 업데이트
    var progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    if (this.quizElements.progressFill) {
        this.quizElements.progressFill.style.width = progress + '%';
    }
    
    // 옵션 버튼 생성
    if (this.quizElements.optionsGrid) {
        this.quizElements.optionsGrid.innerHTML = '';
        var self = this;
        
        question.options.forEach(function(option, index) {
            var button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', function() {
                self.selectAnswer(option, this);
            });
            self.quizElements.optionsGrid.appendChild(button);
        });
    }
    
    // 네비게이션 버튼 상태 업데이트
    if (this.quizElements.prevBtn) {
        this.quizElements.prevBtn.disabled = this.currentQuestionIndex === 0;
    }
    if (this.quizElements.nextBtn) {
        this.quizElements.nextBtn.disabled = !this.isAnswered;
    }
    
    this.isAnswered = false;
    this.selectedAnswer = null;
}

WordQuiz.prototype.selectAnswer = function(answer, buttonElement) {
    if (this.isAnswered) return;
    
    this.selectedAnswer = answer;
    var question = this.questions[this.currentQuestionIndex];
    
    // 모든 옵션 버튼 비활성화
    var allButtons = this.quizElements.optionsGrid.querySelectorAll('.option-btn');
    var self = this;
    
    allButtons.forEach(function(btn) {
        btn.disabled = true;
        if (btn.textContent === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (btn === buttonElement && answer !== question.correctAnswer) {
            btn.classList.add('incorrect');
        }
    });
    
    this.isAnswered = true;
    if (this.quizElements.nextBtn) {
        this.quizElements.nextBtn.disabled = false;
    }
    
    // 정답 체크 및 점수 업데이트
    if (answer === question.correctAnswer) {
        this.score++;
        if (this.quizElements.currentScore) {
            this.quizElements.currentScore.textContent = this.score;
        }
    }
}

WordQuiz.prototype.nextQuestion = function() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.displayQuestion();
    } else {
        this.showResult();
    }
}

WordQuiz.prototype.previousQuestion = function() {
    if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.displayQuestion();
    }
}

WordQuiz.prototype.showResult = function() {
    this.showScreen('result');
    
    if (this.resultElements.finalScore) {
        this.resultElements.finalScore.textContent = this.score;
    }
    
    // 점수에 따른 메시지
    var message = '';
    var percentage = (this.score / this.questions.length) * 100;
    
    if (percentage >= 90) {
        message = '훌륭합니다! 👏';
    } else if (percentage >= 70) {
        message = '잘했어요! 👍';
    } else if (percentage >= 50) {
        message = '괜찮아요! 😊';
    } else {
        message = '더 노력해봐요! 💪';
    }
    
    if (this.resultElements.scoreMessage) {
        this.resultElements.scoreMessage.textContent = message;
    }
    
    // 점수 저장
    saveScore(this.score);
}

WordQuiz.prototype.showScores = function() {
    this.loadScores();
    this.showScreen('scores');
}

WordQuiz.prototype.loadScores = function() {
    try {
        console.log('Loading scores...');
        var scores = getScores();
        console.log('Raw scores from getScores():', scores);
        
        var scoresList = this.scoresElements.scoresList;
        
        if (!scoresList) {
            console.error('scoresList element not found');
            return;
        }
        
        scoresList.innerHTML = '';
        
        if (!scores || !Array.isArray(scores)) {
            console.warn('Invalid scores data:', scores);
            scoresList.innerHTML = '<p class="no-scores">점수 데이터 형식이 올바르지 않습니다.</p>';
            return;
        }
        
        if (scores.length === 0) {
            scoresList.innerHTML = '<p class="no-scores">아직 기록된 점수가 없습니다.</p>';
            return;
        }
        
        console.log('Found ' + scores.length + ' scores');
        
        // 최신 점수부터 표시 (원본 배열은 변경하지 않음)
        var sortedScores = scores.slice().reverse();
        
        sortedScores.forEach(function(scoreData, index) {
            if (index >= 20) return; // 최근 20개만 표시
            
            if (!scoreData || typeof scoreData.score === 'undefined' || !scoreData.date) {
                console.warn('Invalid score data:', scoreData);
                return;
            }
            
            var scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            
            var date = new Date(scoreData.date);
            var dateStr = date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            scoreItem.innerHTML = '<div class="score-date">' + dateStr + '</div><div class="score-value">' + scoreData.score + '/10</div>';
            
            scoresList.appendChild(scoreItem);
        });
        
        console.log('Scores loaded successfully');
        
    } catch (error) {
        console.error('Error loading scores:', error);
        if (this.scoresElements.scoresList) {
            this.scoresElements.scoresList.innerHTML = '<p class="no-scores">점수를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }
}

WordQuiz.prototype.clearScores = function() {
    if (confirm('모든 점수 기록을 삭제하시겠습니까?')) {
        clearScores();
        this.loadScores();
    }
}

WordQuiz.prototype.showStartScreen = function() {
    this.showScreen('start');
}