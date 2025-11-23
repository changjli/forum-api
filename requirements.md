Starter Project Forum API
Authentication merupakan salah satu fitur yang harus dimiliki Forum API. Namun karena pada latihan Anda sudah membangun Auth API, jadi fitur tersebut tidak akan kami jadikan sebagai syarat atau kriteria. Anda dapat menggunakan Auth API sebagai starter project atau mengunduhnya pada tautan yang sudah kami sediakan:

Forum API Starter Project

Berikut beberapa catatan yang perlu Anda ketahui mengenai starter project yang kami sediakan:

Starter Project yang kami berikan kurang lebih sama seperti proyek Auth API pada latihan modul Clean Architecture.
Starter Project Forum API sudah mencakup fitur:
Registrasi Pengguna;
Login;
Refresh Access Token; dan
Logout;
Starter Project sudah memiliki pengujian yang lengkap dan menerapkan 100% Test Coverage.
Pada starter project kami sudah sediakan berkas .env dan konfigurasi untuk melakukan pengujian database. Anda boleh menyesuaikan nilai environment variable sesuai kebutuhan Anda bila diperlukan.
Starter project bersifat opsional. Bila Anda ingin mengerjakan submission dari awal, pastikan Forum API memiliki fitur yang sudah disebutkan pada poin kedua.

Kriteria Forum API
Terdapat 6 kriteria utama yang harus Anda penuhi dalam membuat proyek Forum API.

Kriteria 1: Menambahkan Thread
API harus dapat menambahkan thread melalui route:

Method: POST
Path: /threads
Body Request:

{
"title": string,
"body": string
}
Response yang harus dikembalikan:

Status Code: 201
Response Body:

{
"status": "success",
"data": {
"addedThread": {
"id": "thread-h_W1Plfpj0TY7wyT2PUPX",
"title": "sebuah thread",
"owner": "user-DWrT3pXe1hccYkV1eIAxS"
}
}
}
Ketentuan:

Menambahkan thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang membuat thread.
Jika properti body request tidak lengkap atau tidak sesuai, maka:
Kembalikan dengan status code 400; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.

Kriteria 2: Menambahkan Komentar pada Thread
API harus dapat menambahkan komentar pada thread melalui route:

Method: POST
Path: /threads/{threadId}/comments
Body Request:

{
"content": string
}
Response yang harus dikembalikan:

Status Code: 201
Response Body:

{
"status": "success",
"data": {
"addedComment": {
"id": "comment-\_pby2_tmXV6bcvcdev8xk",
"content": "sebuah comment",
"owner": "user-CrkY5iAgOdMqv36bIvys2"
}
}
}
Ketentuan:

Menambahkan komentar pada thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang membuat komentar.
Jika thread yang diberi komentar tidak ada atau tidak valid, maka:
Kembalikan dengan status code 404; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.
Jika properti body request tidak lengkap atau tidak sesuai, maka:
Kembalikan dengan status code 400; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.

Kriteria 3: Menghapus Komentar pada Thread
API harus dapat menghapus komentar pada thread melalui route:

Method: DELETE
Path: /threads/{threadId}/comments/{commentId}

Response yang harus dikembalikan:

Status Code: 200
Response Body:

{
"status": "success"
}
Ketentuan:

Menghapus komentar pada thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang menghapus komentar.
Hanya pemilik komentar yang dapat menghapus komentar. Bila bukan pemilik komentar, maka:
Kembalikan dengan status code 403; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.
Jika thread atau komentar yang hendak dihapus tidak ada atau tidak valid, maka:
Kembalikan dengan status code 404; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.
Komentar dihapus secara soft delete, alias tidak benar-benar dihapus dari database. Anda bisa membuat dan memanfaatkan kolom seperti is_delete sebagai indikator apakah komentar dihapus atau tidak.

Kriteria 4: Melihat Detail Thread
API harus dapat melihat detail thread melalui route:

Method: GET
Path: /threads/{threadId}

Response yang harus dikembalikan:

Status Code: 200
Response Body:

{
"status": "success",
"data": {
"thread": {
"id": "thread-h_2FkLZhtgBKY2kh4CC02",
"title": "sebuah thread",
"body": "sebuah body thread",
"date": "2021-08-08T07:19:09.775Z",
"username": "dicoding",
"comments": [
{
"id": "comment-_pby2_tmXV6bcvcdev8xk",
"username": "johndoe",
"date": "2021-08-08T07:22:33.555Z",
"content": "sebuah comment"
},
{
"id": "comment-yksuCoxM2s4MMrZJO-qVD",
"username": "dicoding",
"date": "2021-08-08T07:26:21.338Z",
"content": "**komentar telah dihapus**"
}
]
}
}
}
Ketentuan:

Mendapatkan detail thread merupakan resource terbuka. Sehingga tidak perlu melampirkan access token.
Jika thread yang diakses tidak ada atau tidak valid, maka:
Kembalikan dengan status code 404; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.
Wajib menampilkan seluruh komentar yang terdapat pada thread tersebut sesuai dengan contoh di atas.
Komentar yang dihapus ditampilkan dengan konten **komentar telah dihapus**.
Komentar diurutkan secara ascending (dari kecil ke besar) berdasarkan waktu berkomentar.

Kriteria 5: Menerapkan Automation Testing
Proyek Forum API wajib menerapkan automation testing dengan kriteria berikut:

Unit Testing:
Wajib menerapkan Unit Testing pada bisnis logika yang ada. Baik di Entities ataupun di Use Case.
Integration Test:
Wajib menerapkan Integration Test dalam menguji interaksi database dengan Repository.

Kriteria 6: Menerapkan Clean Architecture
Proyek Forum API wajib menerapkan Clean Architecture. Di mana source code terdiri dari 4 layer yaitu:

Entities (jika dibutuhkan)
Tempat penyimpanan data entitas bisnis utama. Jika suatu bisnis butuh mengelola struktur data yang kompleks, maka buatlah entities.
Use Case:
Di gunakan sebagai tempat menuliskannya flow atau alur bisnis logika.
Interface Adapter (Repository dan Handler)
Mediator atau penghubung antara layer framework dengan layer use case.
Frameworks (Database dan HTTP server)
Level paling luar merupakan bagian yang berhubungan dengan framework.

Kriteria Opsional Forum API
Selain kriteria utama, terdapat kriteria opsional yang yang dapat Anda penuhi agar mendapat nilai yang baik.

Menambahkan Balasan pada Komentar Thread
API harus dapat menambahkan balasan pada komentar thread melalui route:

Method: POST
Path: /threads/{threadId}/comments/{commentId}/replies
Body Request:

{
"content": string
}
Response yang harus dikembalikan:

Status Code: 201
Response Body:

{
"status": "success",
"data": {
"addedReply": {
"id": "reply-BErOXUSefjwWGW1Z10Ihk",
"content": "sebuah balasan",
"owner": "user-CrkY5iAgOdMqv36bIvys2"
}
}
}
Ketentuan:

Menambahkan balasan pada komentar thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang membuat balasan komentar.
Jika thread atau komentar yang diberi balasan tidak ada atau tidak valid, maka:
Kembalikan dengan status code 404; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.
Jika properti body request tidak lengkap atau tidak sesuai, maka:
Kembalikan dengan status code 400; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.
Balasan pada komentar thread harus ditampilkan pada setiap item comments ketika mengakses detail thread. Contohnya seperti ini:

{
"status": "success",
"data": {
"thread": {
"id": "thread-AqVg2b9JyQXR6wSQ2TmH4",
"title": "sebuah thread",
"body": "sebuah body thread",
"date": "2021-08-08T07:59:16.198Z",
"username": "dicoding",
"comments": [
{
"id": "comment-q_0uToswNf6i24RDYZJI3",
"username": "dicoding",
"date": "2021-08-08T07:59:18.982Z",
"replies": [
{
"id": "reply-BErOXUSefjwWGW1Z10Ihk",
"content": "**balasan telah dihapus**",
"date": "2021-08-08T07:59:48.766Z",
"username": "johndoe"
},
{
"id": "reply-xNBtm9HPR-492AeiimpfN",
"content": "sebuah balasan",
"date": "2021-08-08T08:07:01.522Z",
"username": "dicoding"
}
],
"content": "sebuah comment"
}
]
}
}
}
Balasan yang dihapus ditampilkan dengan konten **balasan telah dihapus**.
Balasan diurutkan secara ascending (dari kecil ke besar) berdasarkan waktu berkomentar.

Menghapus Balasan pada Komentar Thread
API harus dapat menghapus balasan pada komentar thread melalui route:

Method: DELETE
Path: /threads/{threadId}/comments/{commentId}/replies/{replyId}
Response yang harus dikembalikan:

Status Code: 200
Response Body:

{
"status": "success"
}
Ketentuan:

Menghapus balasan pada komentar thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang menghapus balasan.
Hanya pemilik balasan yang dapat menghapus balasan. Bila bukan pemilik balasan, maka:
Kembalikan dengan status code 403; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.
Jika thread, komentar, atau balasan yang hendak dihapus tidak ada atau tidak valid, maka:
Kembalikan dengan status code 404; serta
Berikan body response:
status: “fail”
message: Pesan apapun selama tidak kosong.
Balasan dihapus secara soft delete, alias tidak benar-benar dihapus dari database. Anda bisa membuat dan memanfaatkan kolom seperti is_delete sebagai indikator apakah komentar dihapus atau tidak.

Pengujian API
Ketika membangun Forum API, tentu Anda perlu menguji untuk memastikan API berjalan sesuai dengan kriteria yang ada. Kami sudah menyediakan berkas Postman Collection dan Environment yang dapat Anda gunakan untuk pengujian. Silakan unduh berkasnya pada tautan berikut:

Forum API V1 Postman Collection + Environment Test.

Cara Import Collection dan Environment Forum API
Silakan unduh tautan yang diberikan di atas.
Ekstrak berkas yang sudah diunduh hingga menghasilkan dua berkas file JSON.
Kemudian import kedua berkas tersebut pada Postman. Caranya, buka aplikasi Postman, klik tombol Import yang berada di atas panel kiri aplikasi Postman.
Kemudian klik tombol Upload Files untuk meng-import kedua berkas JSON hasil ekstraksi.
Pilih kedua berkas JSON hasil ekstraksi dan klik tombol Open.
Kemudian klik Import.
Setelah itu, Forum API V1 Collection dan Environment akan tersedia pada Postman Anda.
Jangan lupa untuk gunakan Environment yang sudah diimpor.

Tips Menjalankan Pengujian Forum API
Pastikan Anda selalu menjalankan pengujian secara berurutan. Karena beberapa request membutuhkan nilai yang didapat dari request sebelumnya. Contoh, pengujian pada folder Authentications membutuhkan folder Users untuk dijalankan. Karena untuk mendapatkan melakukan autentikasi, tentu harus ada data pengguna di database.
Untuk menjalankan request secara berurutan sekaligus, Anda bisa memanfaatkan fitur Collection Runner.
Kerjakanlah proyek fitur demi fitur, agar Anda mudah dalam menjalankan pengujiannya.
Jika merasa seluruh fitur yang dibangun sudah benar namun pengujiannya selalu gagal, kemungkinan database Anda kotor dengan data pengujian yang Anda lakukan sebelum-sebelumnya, dan itu bisa menjadi salah satu penyebab pengujian selalu gagal. Solusinya, silakan hapus seluruh data (truncate) pada tabel melalui psql.

Kriteria Penilaian Submission
Submission Anda akan dinilai oleh Reviewer guna menentukan kebenaran submission yang Anda kerjakan. Agar dapat melanjutkan pembelajaran, proyek Forum API harus memenuhi seluruh pengujian otomatis pada seluruh Postman Request, terkecuali request yang bertanda [optional]. Bila salah satu pengujiannya gagal, maka proyek Anda akan kami tolak.

Submission Anda akan dinilai oleh Reviewer dengan skala 1-5. Untuk mendapatkan nilai tinggi, Anda bisa menerapkan beberapa saran berikut:

Menyelesaikan kriteria opsional, yakni fitur balasan komentar thread.
Menerapkan functional test (Hapi server test) untuk resource thread dan comment.
Menerapkan 100% Test Coverage.
Menuliskan kode dengan bersih alias mematuhi style guide yang Anda tetapkan.

Berikut adalah detail penilaian submission:

Bintang 1 : Semua ketentuan wajib terpenuhi, namun terdapat indikasi kecurangan dalam mengerjakan submission.
Bintang 2 : Semua ketentuan wajib terpenuhi, namun terdapat kekurangan pada penulisan kode. Seperti tidak menerapkan modularization atau gaya penulisan tidak konsisten.
Bintang 3 : Semua ketentuan wajib terpenuhi, namun tidak terdapat improvisasi atau persyaratan opsional yang dipenuhi.
Bintang 4 : Semua ketentuan wajib terpenuhi dan menerapkan minimal dua saran di atas.
Bintang 5 : Semua ketentuan wajib terpenuhi dan menerapkan seluruh saran di atas.

Catatan:
Jika submission Anda ditolak maka tidak ada penilaian. Kriteria penilaian bintang di atas hanya berlaku jika submission Anda lulus.

Ketentuan Berkas Submission
Berkas submission yang dikirim merupakan folder proyek dari Forum API dalam bentuk ZIP.
Pastikan di dalam folder proyek yang Anda kirim terdapat berkas package.json.
Untuk menjaga kredensial Anda, diperbolehkan untuk tidak melampirkan berkas .env selama penamaan variable environment sesuai dengan starter proyek yang kami sediakan.
Pastikan Anda hapus dulu berkas node_modules pada folder proyek sebelum mengkompresi dalam bentuk ZIP.

Submission Anda akan Ditolak bila
Kriteria wajib Forum API tidak terpenuhi.
Ketentuan berkas submission tidak terpenuhi.
Proyek yang Anda kirim tidak dapat dijalankan dengan baik (Reviewer menggunakan Node.js versi LTS v22).
Menggunakan database selain PostgreSQL.
Menggunakan bahasa pemrograman dan teknologi lain, selain JavaScript atau TypeScript dan Node.js.
Menggunakan Framework Node.js selain Hapi Framework dan Express.
Melakukan kecurangan seperti tindakan plagiasi.
