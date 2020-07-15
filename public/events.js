window.addEventListener('DOMContentLoaded', () => {
  const fetchPic = async () => {
    let res = await fetch("/kitten/image");
    const data = await res.json();
    let pic = document.getElementsByTagName("img")[0];
    if(res.status === 200){
      pic.setAttribute("src", data.src);
      pic.style.height = "250px";
      pic.style.width = "250px";
      errorEl.innerHTML = '';
    } else {
      handleError(data.message);
    }
  }
  fetchPic();

  let score = document.getElementsByClassName('score')[0];
  let newCat = document.getElementById("new-pic");
  let errorEl = document.getElementsByClassName("error")[0];

  newCat.addEventListener("click", async e => {
      let loader = document.getElementsByClassName("loader")[0];
      loader.innerHTML = "Loading...";
      await fetchPic();
      score.innerHTML = 0;
      loader.innerHTML = "";
      document.getElementsByClassName('comments')[0].innerHTML = '';
  })

  let upvoteBtn = document.getElementById('upvote');
  let downvoteBtn = document.getElementById('downvote');

  const updateScore = (str) => {
    return fetch(`/kitten/${str}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({}),
    })
  };

  const addUpVote = async (e) => {
    const res = await updateScore('upvote');
    const data = await res.json();
    if(res.status === 200){
      score.innerHTML = data.score;
    } else {
      handleError(data.message);
    }
  };

  const addDownVote = async (e) => {
    const res = await updateScore('downvote');
    const data = await res.json();
    if(res.status === 200){
      score.innerHTML = data.score;
    } else {
      handleError(data.message);
    }
  };
  upvoteBtn.addEventListener('click', addUpVote);
  downvoteBtn.addEventListener('click', addDownVote);

  let commentForm = document.getElementsByClassName('comment-form')[0];
  let commentInput = document.getElementsByTagName('input')[0];

  let createComment = (comment) => {
    return fetch("/kitten/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
      }),
    })
  };

  let appendComment = (value) => {
    const newComment = document.createElement('div');
    newComment.innerHTML = value[value.length-1];
    const newButton = document.createElement('button');
    newButton.innerHTML = 'Delete';
    newButton.style.margin = '10px';
    newButton.setAttribute('data-index', value.length-1);
    newComment.append(newButton);
    document.getElementsByClassName('comments')[0].append(newComment);
  }

  commentForm.addEventListener("submit", async e => {
      e.preventDefault();
      let commentValue = commentInput.value;
      const res = await createComment(commentValue);
      const data = await res.json();
      console.log(data, data.comments);
      if(res.status === 200){
        appendComment(data.comments);
      } else {
        handleError(data.message);
      }
  })

  function handleError(message) {
      errorEl.innerHTML = message;
      errorEl.style.color = "red";
  }

  let deleteComment = (idx) => {
    return fetch(`/kitten/comments/${idx}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  };

  let comments = document.getElementsByClassName('comments')[0];
  const handleDeleteClick = async (e) => {
    if(e.target.tagName === 'BUTTON'){
      let id = e.target.dataset.index;
      let res = await deleteComment(id);
      let data = await res.json();
      if(res.status === 200){
        comments.innerHTML = '';
        if(data.comments.length > 0){
          data.comments.forEach(el => {
            appendComment([el]);
          });
        }
      } else {
        handleError(data.message);
      }
    }
  };


  comments.addEventListener('click', handleDeleteClick);
});
