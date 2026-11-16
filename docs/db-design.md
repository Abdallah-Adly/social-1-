# DB Design 

## User

- id
- userName
- email
- password
- phoneNumber
- gender
- provider
- isDeleted
- createdAt
- updatedAt


## Post 

- id
- content
- userId
- createdAt
- updatedAt
- isDeleted
- commentsCounts
- reactionsCounts
- allowsComments Boolean



## Comment/Reply

- id
- content 
- userId
- postId
- parentId
- reactionsCounts
- createdAt
- updatedAt
- isDeleted

## Reaction

- id
- userId
- refId [postId , commentId]
- onModel ["Post","Comment"]
- type ENUM('Like','Love','Care','Angry')
- createdAt
- updatedAt