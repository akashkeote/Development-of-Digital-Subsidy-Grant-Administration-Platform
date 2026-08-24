import os

app_file = "src/main/java/com/government/infosys/entity/Application.java"
with open(app_file, "r") as f:
    content = f.read()

content = content.replace('''    @Column(name = "scheme_id", nullable = false)
    private Long schemeId;''', '''    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;''')

with open(app_file, "w") as f:
    f.write(content)

print("Application.java updated.")
