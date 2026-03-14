// 단어 학습 데이터
const wordsData = [
    {
        word: "abandon",
        meaning: "버리다, 포기하다"
    },
    {
        word: "ability",
        meaning: "능력, 재능"
    },
    {
        word: "absent",
        meaning: "결석한, 없는"
    },
    {
        word: "absorb",
        meaning: "흡수하다, 집중하다"
    },
    {
        word: "accept",
        meaning: "받아들이다, 동의하다"
    },
    {
        word: "access",
        meaning: "접근, 이용권한"
    },
    {
        word: "accident",
        meaning: "사고, 우연"
    },
    {
        word: "accompany",
        meaning: "동반하다, 수반하다"
    },
    {
        word: "accomplish",
        meaning: "성취하다, 완수하다"
    },
    {
        word: "according",
        meaning: "따라서, ~에 따라"
    },
    {
        word: "account",
        meaning: "계정, 설명"
    },
    {
        word: "accurate",
        meaning: "정확한, 정밀한"
    },
    {
        word: "achieve",
        meaning: "성취하다, 달성하다"
    },
    {
        word: "acquire",
        meaning: "획득하다, 습득하다"
    },
    {
        word: "activity",
        meaning: "활동, 작업"
    }
];

// 점수 데이터를 로컬 스토리지에 저장하는 함수
function saveScore(score, date) {
    try {
        console.log('Saving score:', score, 'Date:', date);
        const scores = JSON.parse(localStorage.getItem('wordQuizScores') || '[]');
        console.log('Current scores before adding:', scores);
        
        scores.push({ 
            score: score, 
            date: date || new Date().toISOString() 
        });
        
        localStorage.setItem('wordQuizScores', JSON.stringify(scores));
        console.log('Score saved successfully');
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// 점수 데이터를 가져오는 함수
function getScores() {
    try {
        const data = localStorage.getItem('wordQuizScores');
        console.log('Raw localStorage data:', data);
        
        if (!data) {
            console.log('No scores found in localStorage');
            return [];
        }
        
        const scores = JSON.parse(data);
        console.log('Parsed scores:', scores);
        
        // 데이터 유효성 검사
        if (!Array.isArray(scores)) {
            console.warn('Invalid scores format, returning empty array');
            return [];
        }
        
        return scores;
    } catch (error) {
        console.error('Error getting scores:', error);
        return [];
    }
}

// 점수 데이터를 초기화하는 함수
function clearScores() {
    try {
        localStorage.removeItem('wordQuizScores');
        console.log('Scores cleared successfully');
    } catch (error) {
        console.error('Error clearing scores:', error);
    }
}

// 테스트 점수 추가 함수
function addTestScores() {
    try {
        console.log('Adding test scores...');
        
        // 기존 점수 삭제
        clearScores();
        
        const now = new Date();
        const sampleScores = [
            { score: 8, date: new Date(now.getTime() - 86400000 * 3).toISOString() }, // 3일 전
            { score: 6, date: new Date(now.getTime() - 86400000 * 2).toISOString() }, // 2일 전
            { score: 9, date: new Date(now.getTime() - 86400000).toISOString() }, // 1일 전
            { score: 7, date: now.toISOString() } // 오늘
        ];
        
        sampleScores.forEach(function(scoreData) {
            saveScore(scoreData.score, scoreData.date);
        });
        
        console.log('Test scores added successfully');
        return true;
    } catch (error) {
        console.error('Error adding test scores:', error);
        return false;
    }
}