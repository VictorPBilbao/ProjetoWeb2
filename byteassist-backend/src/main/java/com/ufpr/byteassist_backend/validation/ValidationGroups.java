package com.ufpr.byteassist_backend.validation;

import jakarta.validation.groups.Default;

public class ValidationGroups {
    public interface Create extends Default {}
    public interface Update extends Default {}
}