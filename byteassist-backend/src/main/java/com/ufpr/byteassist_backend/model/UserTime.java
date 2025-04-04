package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTime {
    public ZonedDateTime created_at;
    public ZonedDateTime last_login_at;
    public ZonedDateTime updated_at;
}
