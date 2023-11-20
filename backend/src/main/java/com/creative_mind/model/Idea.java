package com.creative_mind.model;

import jakarta.persistence.*;

@Entity
@NamedQueries({
        @NamedQuery(name = Idea.FIND_IDEA_BY_ROOM, query = "select i from Idea i where i.brainwritingRoom.roomId = :roomId")
})
public class Idea {

    public static final String FIND_IDEA_BY_ROOM = "Ideas.findByRoom";

    @Id
    @GeneratedValue
    private int id;

    @Column(name = "content")
    private String content;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private BrainwritingRoom brainwritingRoom;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private User member;

    public Idea() {

    }

    public Idea(String content, BrainwritingRoom brainwritingRoom, User member) {
        this.content = content;
        this.brainwritingRoom = brainwritingRoom;
        this.member = member;
    }

    public int getId() {
        return id;
    }

    public String getContent() {
        return content;
    }
}
