package com.creative_mind.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class MorphoRepository {

    @Inject
    EntityManager entityManager;
}
