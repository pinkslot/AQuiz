function quiz_init(q) {
    var s =
        new FileServer(q);
        //new CatsServer(q);
    s.load_quiz();
}
