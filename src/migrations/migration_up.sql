 CREATE TABLE IF NOT EXISTS names (
     n_id INT AUTO_INCREMENT PRIMARY KEY,
     name_field VARCHAR(255) NOT NULL  
     );
 CREATE TABLE IF NOT EXISTS users(
        u_id INT AUTO_INCREMENT PRIMARY KEY,
        login VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
     );
 CREATE TABLE IF NOT EXISTS users_names(
        user_id INT NOT NULL,
        rang INT NOT NULL,
        name_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(u_id),
        FOREIGN KEY (name_id) REFERENCES names(n_id)        
        );
