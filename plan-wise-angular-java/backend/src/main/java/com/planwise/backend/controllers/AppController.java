package com.planwise.backend;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.io.IOException;

@Controller
public class AppController {

    @RequestMapping({
        "/login",
        "/registration",
        "/expenses",
        "/category",
        "/income",
        "/budget-table",
        "/budget-calendar"
    })
    @ResponseBody
    public Resource serveAngularRoutes() throws IOException {
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        return resolver.getResource("classpath:/static/index.html");
    }
}
