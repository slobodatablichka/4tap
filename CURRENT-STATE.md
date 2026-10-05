## Ordinary-app constraint

Android 4Tap — обычное пользовательское приложение на штатном Android.

Из активной архитектуры и roadmap исключены:
- изменение firmware/SystemUI;
- root и bootloader unlock;
- custom ROM / cross-flash;
- privileged/system app;
- обязательная OEM-интеграция;
- AOSP/Cuttlefish как путь реализации продукта.

Историческая SystemUI/AOSP ветвь хранится только как архив и не является вариантом следующего шага.

## Текущая версия

Интерактивная документация v0.5.

## Реализовано

- единая одностраничная карта KnockUI;
- разделы формируются из `data/sections.json`;
- точное место ячейки задаётся полями `section` и `order` в `data/cells.json`;
- охвачены Android, iOS, WeChat и WhatsApp;
- отражены B2C и B2B;
- добавлены региональная стратегия, roadmap и методология;
- каждая ячейка имеет интерактивное пояснение;
- подробная карточка показывает параметры, входы, выходы, ограничения и открытые вопросы;
- поиск по документации;
- фильтры по платформе и модели;
- фильтр по статусу;
- отдельный фильтр по результату технической проверки;
- типизированные видимые связи между ячейками (`flow / branch / model / constraint / strategy / roadmap / governance`);
- фильтр отображения связей;
- подписи активных связей;
- runtime-проверка ссылочной целостности графа;
- прямые URL на ячейки;
- матрица 1296 двухсимвольных комбинаций, включая пары из одинаковых символов.

## Редактирование

Схема содержательных файлов описана в `data/README.md`. Для добавления разделов, ячеек и связей менять HTML не требуется.

## Аудит полноты

Структурный аудит выполнен. Результаты и исправления зафиксированы в `AUDIT-2026-09-28.md`.

Состояние на момент аудита 2026-09-28:
- 50 ячеек;
- 79 связей;

Текущее состояние карты:
- 73 ячейки;
- 155 связей;
- roadmap развёрнут в шесть этапов: Android end-to-end → Product Canon → User Configuration → Integration Catalog → Launch/Monetization+B2B → Cross-platform;
- Android-поток дополнен разрешениями, валидацией зоны, fail-safe, обратной связью первого символа, хранилищем, редактором назначений, compliance и energy budget;
- iOS и WeChat имеют явные action-узлы;
- общие продуктовые принципы связаны с платформенными адаптациями;
- браузер проверяет несуществующие ссылки, дубликаты, неизвестные section/status/type и изолированные ячейки.

## Техническая верификация

Выполнена первая платформенная техническая проверка. Полный результат: `TECH-VERIFICATION-2026-09-28.md`.

Ключевые результаты:
- вывод проверки 2026-09-28 о пассивном raw-touch «где угодно» сохраняется только для того сценария; 2026-09-29 конкретный navigation-bar trigger через `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY` подтверждён на физическом устройстве и снимает его как blocker текущего 4Tap flow;
- `TYPE_APPLICATION_OVERLAY` и permission flow подтверждены как рабочая технология для локального overlay после активации;
- универсальное определение «пустой/неактивной» точки в чужом приложении не может считаться гарантированным;
- Android intents/deep links подтверждены с ограничениями background activity launch и resolver;
- требования Google Play к AccessibilityService и package visibility внесены в документацию;
- проверка 2026-09-28 рассматривала $1 Recognizer как технический ориентир для MVP; текущий implementation-кандидат уже заменил S/C-only прототип собственным profile-driven matcher по 36 каноническим SVG, при этом реальное качество и threshold всё ещё требуют отдельной верификации;
- iOS Custom Keyboard подтверждён как ограниченная input surface; App Review Guideline 4.4.1 блокирует запуск произвольных приложений из keyboard extension;
- WeChat Mini Program подтверждён как локальная/contained среда, не глобальный OS-layer;
- WhatsApp Cloud API подтверждает чатовый command/response transport через webhooks;
- рыночные тезисы вынесены из технической проверки.

На карте появился отдельный узел `android-global-trigger-limitation`, а вводящая в заблуждение прямая flow-связь `android-integration → android-quad-tap` удалена.

## Следующий этап

Первый Android end-to-end рубеж пройден на `LGM-V300L / Android 9`:

`другое приложение → 4 тапа в LEFT/RIGHT области navigation bar → KnockUI → S → C → SC → Android Settings`.

Текущий trigger и KnockUI используют один `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY`; `SYSTEM_ALERT_WINDOW` удалён. ADB/debug broadcast для пользовательской цепочки не требуется. Recognizer v2.1 / Gesture Check / command flow входят в стабильный real-device baseline.

Ближайший цикл — Android field trials и подготовка к release:

1. сохранять recognizer v2.1 / Gesture Check как стабильный baseline без новой воспроизводимой причины;
2. установить текущий APK на несколько других stock Android сначала по USB, затем через непубличный Google Play test-track;
3. подготовить policy/review dossier по обязательному Accessibility core-flow и optional Usage Access personalization;
4. проверить WEB v0.2 candidate: standard IME, явный paste, нормализация/валидация, `https://` при отсутствии схемы и browser `Поделиться → 4Tap`;
5. продолжать Quick Shortcuts / Assignments / KnockUI bugfix и real-device polish;
6. подготовить первичное содержательное наполнение `4tap.ru` и `screencart.com`;
7. сверять дальнейшую B2C-реализацию с `product-b2c → user-gestures / roadmap-3 / android-actions`;
8. вести private IP research-track альтернативного input-method без публичного раскрытия механики до prior-art/patent review;
9. ориентироваться примерно на месяц ходовых испытаний, но выпускать production только после cross-device PASS, store-test, permission/onboarding readiness, стабильного WEB/Assignments flow и отсутствия критических дефектов.

## Полнота технических выводов

Все выводы технической проверки разнесены по интерактивным ячейкам, а не оставлены только в TECH-VERIFICATION-2026-09-28.md.

Дополнительно введены архитектурные узлы:
- `platform-adaptation-model` — общий протокол при разных platform entry/action models;
- `android-activation-redesign` — обязательное решение по замене пассивного глобального trigger;
- `ios-action-redesign` — обязательное решение по iOS execution model.

В `verification` соответствующих ячеек теперь фиксируются не только summary/sources/next_step, но и `implication` — архитектурное следствие. Для WeChat также фиксируется `source_note` о необходимости финальной перепроверки по актуальной официальной документации/DevTools.


## Android activation strategy — ordinary app

Подтверждённая текущая модель:

- 4Tap остаётся обычным приложением на штатном Android;
- пользователь выполняет 4 быстрых тапа в LEFT/RIGHT области navigation bar; продуктовый порог по-прежнему рассматривается как 3/4;
- `AccessibilityService` размещает две небольшие touchable `TYPE_ACCESSIBILITY_OVERLAY` зоны в navigation bar;
- полная последовательность формирует `ActivationRequest`;
- после запуска KnockUI trigger-зоны автоматически перевооружаются;
- SystemUI/AOSP/root/privileged/OEM-only пути исключены;
- Accessibility shortcut не используется.

На LG V30 механизм работает стабильно; LG-specific geometry остаётся только диагностическим baseline.

## Android runtime constraints

В публичной карте обновлён узел `android-runtime-constraints`.

Текущий Android-кандидат использует один user-granted capability:

- `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY` — и navigation-bar trigger, и KnockUI поверх текущего приложения.

`SYSTEM_ALERT_WINDOW` удалён из manifest и не входит в текущий Android-path. AccessibilityService использует `canRetrieveWindowContent=false` и не читает содержимое экранов.

Google Play допускает AccessibilityService и для приложений, не являющихся accessibility tools, но требует declaration, prominent in-app disclosure, affirmative consent и review. Для приложения с AccessibilityService доступен advance notice App Review.

Текущий onboarding строится вокруг одного пользовательского включения Accessibility; это остаётся UX/compliance задачей, а не техническим blocker.

Остальные runtime-ограничения сохраняются: чувствительные экраны могут скрывать application overlay; запуск действий зависит от background-launch rules и intent/deep-link contracts; Settings Console учитывает package visibility.

## Android navigation-bar activation — PASS 2026-09-29

На физическом `LGM-V300L / Android 9` устойчиво подтверждено:

- Accessibility service `4Tap corner activation` включён пользователем;
- real display `1440×2880`, usable `1440×2733`, navigation bar height `147 px`;
- LEFT zone `(0,2712)`, RIGHT zone `(1104,2712)`, size `336×168 px`;
- обе зоны перекрывают navigation bar `Y=2733…2880`;
- 4 быстрых тапа LEFT/RIGHT стабильно запускают KnockUI;
- `S → C → SC` открывает Android Settings;
- после успешного запуска trigger-зоны автоматически re-arm через 700 ms;
- повторные циклы работают без перевключения AccessibilityService.

Предшествующий `ACTION_OUTSIDE` watcher признан непригодным для угловой фильтрации на LG: события приходили, но координаты тапа были `(0,0)`.

Текущий результат закрывает Stage 1 feasibility, но не утверждает финальную permission architecture.

## Android post-activation drawing

Зафиксировано отдельное техническое положение:
- сложность глобального вызова KnockUI не переносится автоматически на последующее рисование;
- после активации можно использовать небольшой временный touchable `TYPE_APPLICATION_OVERLAY`;
- overlay принимает штрихи KnockUI внутри своей области;
- нижележащее приложение в пределах canvas во время ввода не получает эти касания;
- pass-through для gesture canvas не требуется;
- ограничения Android 12 на untrusted pass-through поэтому не блокируют эту схему.

Добавлена ячейка `android-drawing-overlay`. Основной input flow теперь проходит через неё: `Local Canvas → Drawing Overlay Surface → Gesture 1`.


## Android overlay over WeChat / WhatsApp

Зафиксирована двухконтурная модель:
- на Android после успешной активации 4Tap может открыть временный Drawing Overlay Surface поверх текущего foreground app, в том числе поверх WeChat и WhatsApp;
- одновременно сохраняются собственные внутренние KnockUI-пути: WeChat Mini Program и WhatsApp Business/chat transport;
- эти пути независимы и не заменяют друг друга;
- данное решение относится к Android; iOS рассматривается отдельно.

Добавлена ячейка `android-overlay-over-host-apps`.



## Android prototype baseline

Получен первый подтверждённый результат рабочей реализации `4tap-app`:
- минимальный Android-проект создан и успешно собирается;
- debug APK установлен на физическое Android-устройство;
- приложение успешно запущено;
- контрольный экран `4Tap / KnockUI — RUNNING` подтверждён на устройстве.

Этот результат подтверждает только рабочий Android application baseline. Активация KnockUI, Quad Tap, Drawing Overlay Surface и распознавание жестов ещё не реализованы.

Следующий практический шаг: touch-диагностика и минимальная поверхность ввода, затем распознавание эталонных одноштриховых `S` и `C`.


## Android touch prototype

В рабочем репозитории `4tap-app` подтверждён следующий практический рубеж:
- минимальная touch-поверхность работает на физическом Android-устройстве;
- отображается реальная траектория пальца;
- фиксируются touch events, координаты и тайминги;
- результат подтверждён как `TOUCH OK`.

Следующий prototype subset — только оригинальные Palm Graffiti `S` и `C`. Минимальный направленно-чувствительный распознаватель для этих двух знаков уже реализован в коде и ожидает проверки на физическом устройстве.


## Android SC prototype

В рабочем `4tap-app` подтверждён первый жестовый результат на физическом Android-устройстве:
- touch-поверхность работает;
- оригинальный Palm Graffiti `S` распознаётся;
- оригинальный Palm Graffiti `C` распознаётся;
- последовательность `S → C` корректно формирует команду `SC`.

Это ограниченная верификация только двух эталонов и одной тестовой команды. Она не подтверждает качество полного алфавита A–Z / 0–9.

Следующий практический шаг — перенести уже работающий ввод в post-activation KnockUI flow с временной локальной поверхностью, сохранив диагностику.


## Android in-app end-to-end prototype

На физическом Android-устройстве подтверждена ограниченная сквозная цепочка внутри launcher Activity:
- левый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- правый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- после завершения canvas закрывается и последняя команда сохраняется на экране ожидания.

Результат зафиксирован как `LEFT SC OK`, `RIGHT SC OK`.

Граница подтверждения принципиальна: угловые зоны и canvas пока находятся внутри самого 4Tap-приложения. Это проверяет UX/тайминги/распознавание и внутреннюю композицию цепочки, но не доказывает глобальный Android/OEM Quad Tap и не является проверкой `TYPE_APPLICATION_OVERLAY` поверх чужого приложения.

Следующий Android-эксперимент — настоящий временный touchable overlay с тем же подтверждённым `S → C → SC`.


## Android overlay real-device verification

Подтверждён post-activation drawing на физическом Android-устройстве:
- настоящий touchable `TYPE_APPLICATION_OVERLAY` создаётся после тестовой in-app активации;
- overlay остаётся поверх другого foreground-приложения;
- Palm Graffiti `S → C` распознаётся внутри overlay;
- команда `SC` формируется корректно;
- overlay автоматически закрывается после команды;
- сценарий подтверждён для левой и правой стороны: `LEFT OVERLAY SC OK`, `RIGHT OVERLAY SC OK`.

Это существенно сужает Android-риск: post-activation input surface и двухсимвольное распознавание подтверждены. Неподтверждённым остаётся системный/OEM activation trigger, который должен вызывать уже рабочий overlay без предварительного открытия 4Tap Activity.


## Android activation contract verified

После архитектурного разделения повторно подтверждён полный downstream-контур на физическом Android-устройстве:
- `ActivationRequest`;
- `OverlayLauncher`;
- настоящий `TYPE_APPLICATION_OVERLAY`;
- Palm Graffiti recognizer;
- двухсимвольная команда `SC`.

Контрольный результат: `REFACTOR LEFT SC OK`, `RIGHT SC OK`.

Это подтверждает, что источник активации можно менять независимо от overlay/recognizer/command. Текущий in-app 4-tap остаётся test harness. Неподтверждённым остаётся ordinary-app lower-corner trigger, который должен подать тот же `ActivationRequest`.


## Android external activation adapter verified

Подтверждён внешний debug activation adapter на физическом Android-устройстве без предварительного открытия 4Tap Activity:

- explicit broadcast формирует тестовый `ActivationRequest`;
- уже проверенный `OverlayLauncher` открывает настоящий Drawing Overlay поверх другого foreground-приложения;
- `S → C → SC` завершается корректно;
- подтверждены обе стороны: `OEM LEFT SC OK`, `OEM RIGHT SC OK`.

Несмотря на историческое имя `OEM_SYSTEMUI_TEST`, этот adapter является только test harness. Он не задаёт production-архитектуру и не означает зависимость от OEM/SystemUI.

Конкретный production trigger — ordinary-app 3/4-tap sequence в нижнем углу — ещё требует end-to-end проверки.

## Android command action verified

На штатном `LGM-V300L / Android 9` подтверждён следующий рубеж:
- внешний debug trigger формирует `ActivationRequest`;
- настоящий `TYPE_APPLICATION_OVERLAY` открывается поверх другой программы;
- `S → C` формирует `SC`;
- после завершения команды overlay закрывается;
- `SC` запускает назначенное тестовое действие `Settings.ACTION_SETTINGS`.

Таким образом, downstream теперь подтверждён до реального Android action execution:

`ActivationRequest → OverlayLauncher → Drawing Overlay → Recognizer → Command → Action`.

Единственный незакрытый риск Stage 1 — ordinary-app lower-corner 3/4-tap activation без ADB/debug broadcast.

## LG V30 raw touch baseline

Для основной опытной площадки определён touchscreen input-device:

- node: `/dev/input/event1`;
- name: `touch_dev`;
- property: `INPUT_PROP_DIRECT`;
- raw X: `0..1439`;
- raw Y: `0..2879`.

Raw coordinate space совпадает с physical display `1440 × 2880` один-к-одному. Поэтому дальнейшие system-corner tests можно фиксировать непосредственно в физических координатах экрана.

## LG V30 test geometry baseline

Для первой физической Android-площадки `LGM-V300L / Android 9 / V300L30p` зафиксирована текущая геометрия:

- display: `1440 × 2880 px`;
- physical density: `640 dpi`;
- override density: `560 dpi`;
- `NavigationBar`: `[0,2733][1440,2880]`;
- высота панели: `147 px`.

Это диагностический baseline конкретного LG. Эти значения не задают product trigger geometry и не используются как доказательство ownership.

## Android lower-corner activation — canon

Каноническая модель:

- 4Tap — ordinary user app;
- нижний LEFT и RIGHT угол дают целевую область вызова;
- активация — **3 или 4 быстрых тапа**;
- если 4Tap получает всю последовательность, формируется `ActivationRequest`;
- если один или несколько тапов не получены из-за активности приложения, системы или другого обработчика, серия сбрасывается и активация не происходит;
- такой отказ считается естественным ограничением конкретного контекста;
- не требуется отдельная модель ownership/passthrough/replay;
- `TYPE_APPLICATION_OVERLAY` используется только после активации как Drawing Overlay.

Текущая задача — проверить именно эту последовательность на физическом устройстве, а не исследовать SystemUI или точную границу NavigationBar.

## Android SystemUI Quad Tap zone — archived

Ранее исследованная reserved-zone/SystemUI/AOSP ветвь закрыта и сохранена только в истории проекта.

Она не является:
- текущей архитектурой;
- запасным implementation path;
- roadmap branch;
- способом исправлять неудачные угловые активации.

Пользовательский 4Tap должен оставаться обычным приложением на штатном Android.

## Product / UX plan update

В ближайший Android-контур добавлены обязательные продуктовые задачи:

- `4Tap Design Canon`: v0.1 до существенной переработки KnockUI overlay, v0.2 после первой полной real-device цепочки, v1.0 перед публичной beta;
- `4Tap Graffiti Profile`: Palm Graffiti остаётся baseline, но 4Tap утверждает собственные канонические формы; неудобные знаки могут меняться, символ `X` уже вынесен на отдельную проверку;
- `4Tap Settings Console`: установленные/доступные приложения, default-привязки, обучение написанию знаков, UserGestures и пользовательская привязка команды к приложению/действию;
- Settings Console должен поддерживать отдельный приватный профиль `Founder 40`; сами 40 сокращений не публикуются в публичной карте;
- `Default Integration Catalog — Russia`: сначала проверенный app launch, затем документированные deep links/actions;
- российский launch: RuStore как основной канал, другие Android-магазины и Google Play как дополнительные;
- monetization baseline: Free + Pro, subscription только за продолжающийся сервис, B2B/OEM отдельно, без рекламы внутри основного KnockUI-flow;
- продвижение — demo-first: короткая реальная цепочка «текущий контекст → 4Tap → два знака → действие».

Эти направления зафиксированы отдельными связанными ячейками карты и входят в roadmap, а не считаются пост-MVP неопределённостями.

## Current public-map alignment

Публичная карта синхронизирована с рабочим планом `4tap-app`:

- подтверждённый Android milestone: другая программа → 3/4 быстрых угловых тапа → KnockUI → двухзнаковая команда → действие; текущий recognizer v2.1 / Gesture Check / command flow — stable real-device baseline;
- Android activation описан как ordinary-app lower-corner sequence;
- неудачная/неполная tap sequence означает reset, а не переход к системной модификации;
- SystemUI/AOSP ветвь помечена архивной и удалена из активного roadmap-графа;
- Local Canvas связан с общим `ActivationRequest`;
- текущий Product Canon focus — усовершенствование поверхности KnockUI; Design Canon, 4Tap Graffiti Profile, Settings Console, Founder 40 privacy rule и Russia Integration Catalog остаются в roadmap;
- RuStore остаётся primary Russia channel, Google Play и другие магазины — дополнительными;
- monetization и promotion сохранены отдельными продуктными узлами.

## Pair Selection / Command Space — current

Текущая каноническая модель выбора XY:

- Command Space содержит 1296 пар `A–Z + 0–9`; одинаковые пары разрешены;
- `Pair Selection / Выбор знакопары` — единственный механизм назначения XY;
- первый уровень: 36 Graffiti-знаков `6 × 6`;
- второй уровень: 36 вторых Graffiti-знаков `6 × 6`;
- задача второго уровня — только завершить выбор свободной `XY`;
- целевая строка второго уровня: `[Graffiti X] + [второй слот]`, без действия `ВЕДЕТ В`;
- после любой успешно выбранной свободной XY Pair Selection **всегда** открывает `Проверка жеста`;
- занятая пара в `КОМБИНАЦИИ` может открыть существующую `Command`;
- текстовый поиск `A–Z + 0–9` остаётся отдельной навигацией по Command Space;
- рисование не используется для назначения XY.

Текущий Android Command Space уже содержит двухэтапный 6×6 выбор, но ещё требует приведения второго уровня к этому целевому flow и повторного real-device review.

## Canonical Back header refinement

Утверждено общее правило header:

- если иное отдельно не предусмотрено, `Back` располагается слева в верхней заголовочной строке;
- header — `72 dp`;
- touch-area Back — `48 × 48 dp`;
- базовая грамматика: `Back → контекст (если нужен) → название поверхности → действия справа`.

Применено в Android-коде:

- `Commands`: `Back | КОМАНДЫ | Search | Menu`;
- `Destination`: `Back | [slot 1][slot 2] | ВЕДЕТ В`;
- существующая команда показывает в этих слотах текущий Graffiti XY без start/direction markers;
- новая команда через `ADD COMMAND → Destination` показывает два пустых слота.

Refinement реализован и ожидает повторный real-device review.

## Design Canon normalization — canon/graphics gate

После real-device просмотра UI зафиксировано новое обязательное правило разработки:

`общий Design Canon → реестр канонической графики → локальный канон поверхности → код`.

Если правила или нужного графического элемента нет, UI-реализация не начинается до его утверждения/создания.

Нормализовано:

- Back / Menu / Search: touch-area `48 × 48 dp`, видимая каноническая графика `40 × 40 dp`;
- Search является рамочной фирменной пиктограммой; системный Android search icon не используется по умолчанию;
- Frame зарегистрирован как канонический пустой квадрат для слотов/контейнеров;
- внутренняя геометрия и рамка определяются asset, а не отдельной приблизительной цифрой в локальном экране;
- один Back находится в верхнем header и выполняет один уровень назад в текущем контексте;
- второй уровень Command Space больше не имеет дублирующего Back в контекстной строке;
- текущий Android UI требует отдельного conformance-fix; новый PASS пока не зафиксирован.

## Android UI canon-conformance — implemented

По уже реализованным Android-поверхностям выполнено приведение к нормализованному Design Canon:

- добавлены точные Android-производные канонических `Search` и `Frame`;
- `Back / Search / Menu` используют общую схему `48 × 48 dp touch → 40 × 40 dp visible`;
- системный Android Search удалён из `Commands` и `Destination`;
- Menu больше не уменьшается произвольным padding/alpha;
- второй уровень `КОМБИНАЦИИ` больше не содержит дублирующий Back;
- верхний Back на втором уровне возвращает к первому уровню, аппаратный Back ведёт так же;
- слоты `Commands` и `Destination` используют канонический Frame;
- `Command` использует тот же общий helper канонического Back;
- KnockUI/MainActivity не содержат затронутых header-actions/Frame и в этом блоке не менялись.

Новый conformance-pass ещё не получил real-device PASS: требуется `assembleDebug` и повторная проверка на устройстве.

## Command creation / Gesture Check routing — current

Обе ветки используют общий блок:

`Pair Selection → Проверка жеста`.

`Проверка жеста` можно выполнить или пропустить; она не меняет XY.

Маршрутизационный инвариант после проверки:

1. известна `XY`, Destination отсутствует → `ВЕДЕТ В`;
2. Destination был выбран **до XY** через `НАЗНАЧИТЬ` → после выбора XY известны обе части → `КОМАНДА`;
3. при редактировании существующей команды Destination уже известен → новая XY возвращается в `КОМАНДА`.

Общее правило:

`XY + no Destination → ВЕДЕТ В`  
`XY + Destination → КОМАНДА`.

Отсюда два create-flow:

- destination-first: `ADD COMMAND → НАЗНАЧИТЬ → Destination → Pair Selection → Проверка жеста → Command`;
- pair-first: `Commands / КОМБИНАЦИИ → Pair Selection → Проверка жеста → ВЕДЕТ В → Destination → Command`.

Редактирование XY:

`Command → Pair Selection → Проверка жеста → Command`.

`ВЕДЕТ В` всегда требует известную XY. `НАЗНАЧИТЬ` используется только тогда, когда Destination выбирается до XY.

Android-маршрутизация подтверждена на физическом устройстве 2026-10-01: destination-first и pair-first проходят до конца. Новая созданная команда после этого трижды успешно выполнена через KnockUI. Existing-Command XY edit остаётся отдельной непроверенной device-веткой.

## Pair Selection — contextual geometry approved

The public architecture now records one shared Pair Selection geometry:

- one core for all contexts: persistent `[X] + [Y]` context row + `6×6 X → 6×6 Y`;
- the context row stays in the same place on both stages, so the grid does not jump;
- stage 1 shows `[□] + [□]`; stage 2 shows `[X] + [□]`;
- when Destination is already known it is shown at right as `ДЛЯ: Destination`;
- standalone destination-first/edit surface: `Back | ЗНАКОПАРА | Search`;
- Commands / КОМБИНАЦИИ hosts the same core under its existing Commands header and mode switch;
- free XY always goes directly to `Проверка жеста`; there is no `ДАЛЬШЕ`, `ВЕДЕТ В`, or `ДОБАВИТЬ КОМАНДУ` inside Pair Selection;
- occupied families/pairs are muted; Commands may inspect an occupied pair, while creation/edit cannot select it;
- the current self-pair of an edited Command does not conflict with itself;
- Search is navigation through the same selector: 1 character → X/Y stage, 2 characters → exact XY;
- Back: Y→X; standalone X after НАЗНАЧИТЬ→НАЗНАЧИТЬ preserving Destination; standalone X from Command→Command unchanged.

Pair Selection geometry is approved. The shared `PairSelectionGridView` + standalone `ЗНАКОПАРА` are present in the current Android baseline; pair-first and destination-first flows passed on a physical device. Existing-Command XY edit remains a separate explicit device check.

## Gesture Check — approved base surface

The public architecture now records the concrete Gesture Check behavior:

- `Back | ПРОВЕРКА ЖЕСТА`;
- both `[X] + [Y]` examples remain visible;
- при входе активен X и действует режим `AUTO`;
- успешный X в `AUTO` автоматически переводит активность на Y; FAIL не переключает знак;
- любой явный тап пользователя по X или Y переводит сессию в `MANUAL`, после чего автопереключение отключено;
- любой знак можно перерисовывать без ограничения, включая после PASS;
- один fixed drawing canvas не меняет положение из-за recognition feedback;
- feedback текстовый; новые PASS/FAIL pictograms не вводятся;
- fixed four-line zone резервирует до двух строк для последнего X-result и двух для Y;
- новая попытка очищает старый feedback только активного знака уже на `ACTION_DOWN`; результат второго знака сохраняется;
- before any attempt the bottom action is `ПРОПУСТИТЬ`; after an attempt it is `ПРОДОЛЖИТЬ`;
- PASS/FAIL never gates continuation and is not persisted as part of Command;
- exit routing remains `XY + no Destination → ВЕДЕТ В`, `XY + Destination → КОМАНДА`.

The current Android build uses a 72 dp pair row, adaptive canvas, fixed four × 24 dp feedback lines and fixed 56 dp bottom action. These implementation-level values are present in the stable physical-device baseline, but they are not promoted to generic canon solely by that stability result.

## Pair Selection / Gesture Check / Recognizer — Android candidate implemented

Private `4tap-app` now contains the complete implementation candidate for the approved command-flow block:

- one shared `PairSelectionGridView` for Commands, destination-first and existing-Command edit;
- standalone `Back | ЗНАКОПАРА | Search` surface;
- pair-first: `XY → Gesture Check → ВЕДЕТ В → Destination → Command`;
- destination-first: `НАЗНАЧИТЬ → Destination → ЗНАКОПАРА → Gesture Check → Command`;
- edit: `Command → ЗНАКОПАРА → Gesture Check → Command`;
- Gesture Check supports arbitrary X/Y switching, unlimited retries, independent latest-result feedback and non-blocking skip/continue;
- recognizer now loads all 36 canonical Profile v1 SVG strokes instead of hardcoded S/C templates;
- recognizer tests were added for all canonical self-matches, scale/translation invariance and S/5, I/1, Z/2.

Current verification status:

1. `testDebugUnitTest` — PASS (`BUILD SUCCESSFUL`, 2026-10-01);
2. `assembleDebug` — PASS (`BUILD SUCCESSFUL`, 2026-10-01);
3. pair-first and destination-first creation — real-device PASS;
4. newly created command execution through KnockUI — PASS ×3;
5. recognizer v2.1 / Gesture Check / current command flow — stable physical-device baseline;
6. Existing-Command XY edit — still requires its own explicit device check.

## Real-device command creation + recognizer review — 2026-10-01

Confirmed:

- destination-first creation — PASS;
- pair-first creation — PASS;
- a newly created command executed through KnockUI three times — PASS ×3.

Findings at the first 36-symbol checkpoint:

- the initial recognizer pipeline ran, but many finger-drawn symbols were misclassified;
- old F was especially impractical to recognize and was replaced by the canonical phi-like `Letter-F.svg`;
- Gesture Check showed a stale-feedback bug on retry;
- the approved fix clears only active-sign feedback at stroke start and preserves the other sign's result;
- the approved X/Y policy starts in `AUTO`, moves X PASS → Y, and switches permanently to `MANUAL` after an explicit X/Y tap.

These findings led to the v2 refinement below and are no longer the current recognizer status.

## Recognizer v2 + Gesture Check refinement — completed checkpoint

The approved v2 pass introduced:

- canonical revised F from the same Profile v1 SVG source;
- Gesture Check feedback reset at `ACTION_DOWN`;
- `AUTO → MANUAL` X/Y switching;
- 64-sample preprocessing plus bounded DTW;
- local comparison cost using normalized position (0.55), tangent/direction (0.30) and local turn (0.15);
- an 18% DTW band with minimum 6 samples and a 0.01 non-diagonal warp-step penalty;
- no real user-trace accumulation or personalization.

`testDebugUnitTest` and `assembleDebug` passed on 2026-10-01. The subsequent device review exposed O/Q and 4/9 cases and led directly to v2.1; this v2 checkpoint is closed.

## iOS implementation options

iOS больше не описывается как keyboard-only архитектура. Зафиксированы варианты реализации, окончательный выбор отложен.

Entry candidates:
- `Custom Keyboard Extension` — ввод внутри text-entry контекста;
- `Back Tap` — системный Double Tap/Triple Tap по задней панели с запуском Shortcut;
- `Action Button` — запуск Shortcut/Control на поддерживаемых моделях;
- `Control Center / Lock Screen Control` — WidgetKit Control.

Общий системный мост:
- `App Intents / Shortcuts Bridge` — связывает перечисленные системные triggers с действиями KnockUI.

Важно:
- эти механизмы не создают произвольный overlay поверх чужого iOS-приложения;
- часть App Intents может выполнять действие без отдельного UI, но это проверяется предметно для каждой команды;
- открытие приложения через intent/shortcut переводит пользователя в KnockUI app;
- конкретная комбинация entry/action paths пока не утверждена.

Добавлены ячейки `ios-back-tap`, `ios-action-button`, `ios-system-controls`, `ios-app-intents-shortcuts`. Ячейка `ios-activation` преобразована в общий узел вариантов.

## Accessibility-only KnockUI — PASS

2026-09-29 на `LGM-V300L / Android 9` подтверждена полная цепочка при выключенном системном доступе «Поверх других приложений»: `4 taps → AccessibilityService → TYPE_ACCESSIBILITY_OVERLAY KnockUI → S → C → SC → Settings`.

`SYSTEM_ALERT_WINDOW` затем полностью удалён из `AndroidManifest.xml`, сборка переустановлена и та же цепочка повторно прошла — PASS. Текущий Android-кандидат требует одного пользовательского системного включения: `4Tap corner activation` в Accessibility.


## Recognizer v2.1 — Q / O-Q / 4-9 refinement

Physical-device review found:

- `O → Q`;
- `4 → 9` in ten consecutive attempts.

The private implementation repo now contains:

- revised canonical `Letter-Q.svg`;
- updated Q checksum;
- generic template orientation from the canonical start marker, because raw SVG path order was found reversed for at least `C`, `O` and `4`;
- endpoint-aware score: start point/direction + end point/direction;
- extra terminal-tail weight over the last 13 of 64 samples;
- no symbol-specific classifier exceptions.

Status: `testDebugUnitTest` and `assembleDebug` — PASS; after installation the v2.1 build was confirmed stable on the physical Android device and is the current baseline.


## Stable Android recognizer baseline — 2026-10-01

After installing the build with revised Q, marker-oriented templates and endpoint/tail-aware recognizer v2.1, the user confirmed on a physical Android device:

**the current 4Tap works well and stably.**

This closes the pending physical-device verification status for recognizer v2.1 / Gesture Check / current command flow and establishes them as the current Android baseline.

Further recognizer changes are opened only for new reproducible problems or a separate planned calibration/personalization stage.

## KnockUI control strip canon — 2026-10-02

Утверждён следующий слой Product Canon KnockUI:

- KnockUI сохраняет две рабочие панели: `Ярлыки` / `Рисование`;
- верхняя полоса — отдельный functional control strip, не обычный `72 dp + Back + title` application header;
- порядок: `4Tap Logo | Ярлыки | Рисование | [Slot 1 | Slot 2 | Send — только Draw] | flexible space | Close`;
- Logo — служебная About-кнопка, а не третья панель; до появления мультфильма рабочая область показывает локализуемый длинный текст с изображениями и вертикальным scroll;
- на светлом фоне белая графика Logo инвертируется в `#159B92`;
- в Draw под control strip выделяется отдельная Destination-line;
- `Send` видим всегда в Draw, disabled до полной исполнимой пары и enabled после её получения;
- без выбора Slot действует `AUTO`: Slot 1 → Slot 2 → Destination preview → auto-Send после короткой заметной задержки;
- tap по Slot отменяет pending auto-Send и переводит Draw в `MANUAL`; выбранный Slot остаётся целью до явного выбора другого, а выполнение возможно только по `Send`;
- в private `4tap-app` добавлены канонические `logo-4tap.svg`, `send.svg`, `close.svg` рядом с существующими KnockUI icons.

Точные размеры окна/строк/control-strip элементов, интервалы, позиционирование, visual states и длительность AUTO-delay пока не утверждены. Следующий шаг — именно эта геометрия; recognizer v2.1 / Gesture Check baseline не меняется.

## KnockUI geometry + Android candidate — 2026-10-02

Подтверждены три решения следующего блока:

- KnockUI мыслится как **широкая компактная нижняя панель / широкое плавающее окно**;
- положение панели не зависит от LEFT/RIGHT trigger: окно центрируется по горизонтали и занимает почти всю ширину с симметричными боковыми отступами;
- высота адаптивная, ориентир `40–45%` доступной высоты, а не фиксированные `390 dp`;
- AUTO-delay после полной исполнимой пары — `1,0 s`; tap по Slot в этот период отменяет auto-Send и переводит Draw в MANUAL.

В private `4tap-app` внесён первый implementation candidate:

- `12 dp` side/bottom margin;
- `42%` screen height, clamp `300–420 dp`;
- `48 dp` control strip;
- `36 dp` Destination-line;
- Android vector derivatives утверждённых Logo / Quick Shortcuts / Drawing / Send / Close;
- persistence последней рабочей панели;
- Logo/About scroll-content;
- Draw Slot 1 / Slot 2;
- Destination preview;
- AUTO / MANUAL;
- executable Send и delayed auto-Send.

Recognizer v2.1 / Gesture Check не изменены.

Статус: **implementation candidate; build/device PASS ещё не зафиксирован**. Следующий рубеж: `testDebugUnitTest → assembleDebug → install APK → real-device review`.

## KnockUI first device review + Logo/About Hub — 2026-10-02

Первый wide-bottom KnockUI candidate прошёл build/install и был просмотрен на физическом Android-устройстве. Общая поверхность оценена как удачная («вообще хорошо»), поэтому wide lower panel geometry principle сохраняется.

Зафиксированы следующие refinement-решения:

- полная распознанная пара без назначения показывает в Destination-line локализуемое `НЕ НАЗНАЧЕНО` / `NOT ASSIGNED`;
- в этом состоянии `Send` disabled, AUTO-send не запускается;
- представление по 4Tap Logo развивается в **Logo/About Hub**, но не становится третьей рабочей панелью;
- верх Hub — расширяемая область action-icons: первый ряд, при необходимости второй/третий, и только затем информационный текст/мультимедиа;
- первый ряд: `Открыть 4Tap` — рабочее действие; `ScreenCart` — future/placeholder; `Поддержать 4Tap` — future/placeholder;
- `Открыть 4Tap` должен закрыть KnockUI и открыть главную рабочую панель полного приложения;
- `Сайт 4Tap` пока не обязателен в первом ряду: URL, необходимость и окончательное место не утверждены;
- добавлены канонические Hub-assets `back-4_tap-dev.svg` и локальная копия `screencart-logo.svg`;
- внешний вид `back-4_tap-dev.svg` утверждён; его три строки `back / <4_tap> / dev` являются частью графики;
- отсутствие содержимого в панели `Ярлыки` сейчас не является дефектом: правила её заполнения будут проектироваться отдельным следующим Design Canon-блоком.

Текущий порядок: `canon/docs/assets → code → build/install → focused device review`. Recognizer v2.1 / Gesture Check baseline не изменяется.

## KnockUI Hub refinement implemented — 2026-10-02

Утверждённый refinement после первого device review реализован в private `4tap-app`:

- полная распознанная пара без assignment показывает локализуемое `НЕ НАЗНАЧЕНО / NOT ASSIGNED`;
- для такой пары `Send` остаётся disabled, AUTO-send не запускается;
- Logo/About показывает первый ряд Hub: `4Tap Logo | ScreenCart | Support 4Tap`, затем информационный текст;
- `Открыть 4Tap` закрывает KnockUI и открывает текущую рабочую поверхность полного приложения — `CommandsActivity`;
- ScreenCart и Support остаются видимыми future/placeholder без маршрута;
- текущий implementation candidate приглушает placeholders reduced-alpha способом; это пока не отдельный визуальный канон;
- добавлены Android derivatives `ic_knockui_screencart.xml` и `ic_knockui_support_4tap.xml`;
- recognizer v2.1 / Gesture Check не изменены.

Статус: **implementation candidate; build/install/device review этого refinement pending**.

Следующий шаг: `testDebugUnitTest → assembleDebug → installDebug → focused device review`, затем отдельное проектирование правил `Ярлыки`.

## Docked 4Tap canon — 2026-10-02

Утверждён новый layout/lifecycle-режим для действия `Открыть 4Tap` из Logo/About Hub.

**Docked 4Tap**:

- KnockUI не закрывается;
- нижний KnockUI становится full-width и остаётся закреплён снизу;
- полный 4Tap целиком занимает оставшуюся верхнюю область;
- обе части вместе заполняют доступную экранную область без перекрытия;
- внутренняя навигация полного 4Tap остаётся в верхней области;
- `Close` закрывает только KnockUI и разворачивает 4Tap на всю доступную область;
- выход из полного 4Tap или запуск внешнего приложения возвращает KnockUI к обычной floating-геометрии;
- другой функционал 4Tap/KnockUI не меняется.

Статус: **canon approved; Android implementation pending**.

## Docked 4Tap implementation candidate — 2026-10-02

Утверждённый Docked 4Tap реализован в Android-кандидате:

- KnockUI переключается `floating ↔ full-width docked` без изменения своей высоты;
- `Открыть 4Tap` сохраняет KnockUI и открывает `CommandsActivity` над ним;
- общий lifecycle-координатор переносит нижний inset, равный высоте KnockUI, на все внутренние Activity 4Tap;
- внутренние переходы 4Tap сохраняют docked layout;
- `Close` снимает inset и закрывает только KnockUI;
- выход из полного 4Tap возвращает KnockUI в floating;
- внешний command launch из docked-state сначала возвращает KnockUI в floating, затем использует прежний executor;
- recognizer v2.1 / Gesture Check не изменены.

Статус: **implementation candidate; build/install/device review pending**.

## Symmetric Docked 4Tap entry — 2026-10-02

Docked 4Tap уточнён как **симметричное** состояние независимо от порядка открытия компонентов:

- `KnockUI → Открыть 4Tap` и `полный 4Tap → corner-trigger → KnockUI` должны приводить к одной компоновке;
- если полный 4Tap уже открыт, corner-trigger создаёт KnockUI сразу в full-width docked-геометрии;
- текущий экран и состояние полного 4Tap сохраняются; автоматического перехода в `Commands` нет;
- в любом другом foreground-приложении corner-trigger продолжает открывать обычный floating KnockUI;
- остальной Docked-contract (`Close`, возврат в floating при выходе из 4Tap, внутренняя навигация сверху) не меняется.

Статус: **canon approved; reverse-entry Android refinement pending**.

## Symmetric Docked entry implemented — 2026-10-02

Обратный вход в Docked 4Tap реализован в Android-кандидате:

- `Application.ActivityLifecycleCallbacks` отслеживает реально resumed внутренние Activity 4Tap;
- при corner-trigger `DrawingOverlay` централизованно решает, создавать KnockUI floating или docked;
- если внутренний экран 4Tap уже foreground, KnockUI сразу создаётся full-width снизу;
- текущий Activity/экран/состояние 4Tap сохраняются и не заменяются `Commands`;
- в любом другом приложении сохраняется обычный floating KnockUI;
- `CornerAccessibilityService` не изменён; trigger остаётся прежним;
- recognizer v2.1 / Gesture Check не изменены.

Статус: **implementation candidate; build/install/device review pending**.

## KnockUI close semantics restored — 2026-10-02

После symmetric Docked entry восстановлен исходный контракт закрытия:

- `X / Close` всегда закрывает KnockUI;
- любая APP / WEB / SYSTEM-команда из KnockUI также закрывает его **до** запуска назначения;
- правило одинаково для floating и docked;
- если рядом открыт полный 4Tap, после `Close` он расправляется на всю доступную область;
- выход из полного 4Tap без выполнения команды по-прежнему возвращает KnockUI из docked в floating.

Регресс исправлен в private Android-коде; build/install/device review этой коррекции pending.

## Docked 4Tap preliminary device PASS — 2026-10-02

Текущий symmetric Docked 4Tap candidate с восстановленным close-contract проверен на физическом Android-устройстве. Пользователь сообщил: **«Вроде всё в порядке»**.

Предварительно подтверждены совместная компоновка 4Tap + KnockUI, обратный вход через corner-trigger, закрытие по `X` и закрытие KnockUI перед выполнением APP / WEB / SYSTEM-команды.

Статус: **preliminary real-device PASS**. Расширенный regression-pass всех внутренних экранов в Docked 4Tap пока отдельно не объявлен завершённым.

## Graffiti rendering scale canon — 2026-10-02

Утверждён единый принцип визуализации канонических Graffiti-знаков на поверхностях разного размера:

- path, толщина trajectory, start point и end arrow масштабируются как единый знак;
- фиксированная независимая `dp`-толщина эталонной/сохранённой траектории по отдельным поверхностям не допускается;
- live finger stroke в KnockUI / Gesture Check остаётся отдельным feedback-layer;
- числовое относительное значение толщины пока не назначено: его нужно получить из уже визуально принятого эталонного размера;
- реализация должна быть общей для Graffiti renderer/helper, а не набором независимых поправок по экранам.

Причина: на малых знаках текущая фиксированная толщина линии становится непропорционально большой и может перекрывать соседние участки траектории.

Статус: **canon approved; implementation pending**.

## Graffiti SVG visual source clarification — 2026-10-02

Уточнён источник визуального эталона Graffiti: предоставленные канонические SVG уже содержат утверждённое сочетание размера и толщины.

Renderer должен сохранять `viewBox + trajectory geometry + stroke-width + start/end marker geometry` каждого SVG и масштабировать их одним transform. Отдельный универсальный коэффициент толщины не требуется.

Текущий Android renderer этот контракт пока не выполняет: он извлекает path/viewBox, но заменяет SVG stroke/guide geometry фиксированными dp-значениями. Статус: **canon clarified; implementation pending**.

## SVG-aware Graffiti renderer implemented — 2026-10-02

Android-кандидат переведён на сохранение визуальных пропорций canonical 4Tap Graffiti SVG:

- `GraffitiGlyphRepository` читает `stroke-width`, start marker и end arrow;
- общий `GraffitiRenderer` масштабирует path, толщину trajectory и guide geometry одним transform;
- `GraffitiGlyphView`, `GraffitiPairView` и KnockUI slots используют общий renderer;
- прежние фиксированные толщины `3.5 / 6 / 2.2 dp` для эталонных знаков устранены;
- практический эталон source SVG: около 45 мм высоты знака → около 3 мм trajectory;
- правило относится только к 4Tap Graffiti, не к live finger stroke и другой UI-графике;
- recognizer v2.1 и canonical SVG не изменены;
- отдельный SVG metadata test не добавлен по принятому решению.

Статус: **implementation candidate; build/install/device review pending**.

## Commands assignment Graffiti composition canon — 2026-10-02

Утверждена новая геометрия 4Tap Graffiti в `Команды → НАЗНАЧЕНИЯ`:

- строка остаётся `64 dp`;
- целевая высота Graffiti — `38–40 dp`; ширина не должна уменьшать эту высоту;
- `X` задаёт эталон высоты и базовую рабочую ширину;
- каждый знак сохраняет естественную SVG-ширину; `I` остаётся узким, `W/M` не уменьшаются по высоте;
- два знака образуют единую композицию, а не две равные ячейки;
- side inset — `4 dp`, inter-glyph gap — `4 dp`;
- базовая ширина рассчитывается от двух X на целевой высоте с `8%` резервом на знак; текущие W/M примерно на `6,7%` шире X при равной высоте;
- Destination уступает ширину через end ellipsis прежде, чем Graffiti начинает терять высоту.

Общее правило guide-маркеров 4Tap Graffiti:

- rendered glyph height `>=36 dp` → обязательны начальный кружок и конечный треугольник;
- rendered glyph height `<36 dp` → оба маркера скрываются;
- порог измеряется в dp, не raw pixels;
- прежнее исключение для назначенной строки Commands отменено.

Статус: **canon approved; Android implementation pending**. Recognizer v2.1 не затрагивается.

## Commands assignment Graffiti layout implemented — 2026-10-02

Android candidate теперь реализует утверждённую геометрию `Команды → НАЗНАЧЕНИЯ`:

- Graffiti-колонка получает рабочую ширину, вычисленную от canonical `X`, а не жёсткий вес `24%`;
- compact pair использует целевую высоту `40 dp`, естественные SVG-ширины, `4 dp` side inset и `4 dp` inter-glyph gap;
- в расчёт ширины заложен `8%` reserve на каждый знак;
- пара центрируется как единая композиция и не делится на две равные ячейки;
- shared `GraffitiRenderer` показывает start circle + end triangle при rendered height `>=36 dp` и скрывает оба ниже порога;
- локальные show/hide guides overrides удалены;
- recognizer v2.1 и live finger stroke не изменены.

Статус: **implementation candidate; build/install/device review pending**.

## Commands assignment Graffiti two-column correction — 2026-10-02

После первого просмотра implementation candidate уточнена структура Graffiti-зоны в `Команды → НАЗНАЧЕНИЯ`.

Исправлено в каноне и Android-коде:

- Graffiti-зона состоит из двух постоянных столбцов одинаковой рабочей ширины;
- первый знак любой знакопары всегда центрируется в первом столбце, второй — во втором;
- вертикальные оси обоих столбцов совпадают во всех строках списка;
- видимого разделителя между внутренними столбцами нет, поэтому два знака продолжают читаться как единая команда;
- каждый знак сохраняет естественную SVG-ширину внутри своего столбца;
- ширина каждого столбца = ширина canonical `X` при target height `40 dp` + `8%` reserve;
- межстолбцовый gap остаётся `4 dp`, боковые insets — по `4 dp`;
- guide threshold `36 dp`, SVG-aware stroke scaling и recognizer v2.1 не менялись.

Статус: **focused real-device PASS** — пользователь подтвердил, что исправленная двухстолбцовая композиция работает.

## KnockUI refinement block approved — 2026-10-03

После focused PASS двухстолбцового `Commands → НАЗНАЧЕНИЯ` утверждён следующий технический этап KnockUI.

Очередь:

1. end-arrow всех отображаемых 4Tap Graffiti — `1.20×` через shared renderer, без изменений recognizer;
2. инфраструктура временной expanded surface над остающимся снизу KnockUI;
3. read-only `6×6` поверхность всех 36 образцов Graffiti; новая пиктограмма ожидается от владельца проекта;
4. `Клавиатура` / Android App Search: standard IME, live-search launchable apps по display name, запуск через существующий app path; новая пиктограмма ожидается;
5. `Ярлыки`: пользовательская закрепляемая grid, возможные горизонтальные страницы; frequent suggestions только из собственной истории 4Tap, без `PACKAGE_USAGE_STATS` в v1;
6. Draw visual feedback: `empty → active → recognized → pair ready → executing`, с ослаблением пустых Frames и усилением feedback результата/действия.

Expanded surfaces не становятся новыми remembered panels. Каждый подпункт проходит отдельный canon/build/device-review gate.

## Graffiti end-arrow +20% implementation — 2026-10-03

Первый подпункт утверждённого KnockUI refinement block реализован в Android candidate.

- shared `GraffitiRenderer` увеличивает end-arrow до `1.20×`;
- local scale применяется только к конечному треугольнику;
- pivot выбирается как геометрический конец trajectory, ближайший к end-arrow, поэтому raw SVG path direction не влияет на привязку;
- trajectory, stroke-width, start circle, canonical SVG и recognizer v2.1 не изменены;
- общее guide visibility rule `>=36 dp` сохранено;
- изменение распространяется на все поверхности, использующие shared renderer.

Статус: **implementation candidate; build/install/device review pending**. Следующий подпункт после проверки — `expanded surface above KnockUI`.

## Gesture Check reference guides enlargement — 2026-10-03

Увеличена reference-row поверхности `Проверка жеста`, чтобы выбранные X/Y отображались с каноническими guide-маркерами и направление написания было явно видно.

Android candidate:

- pair row: `88 dp`;
- reference slot: `80 × 80 dp`;
- canonical Frame: `64 × 64 dp`;
- glyph padding: `6 dp`;
- X-reference height — около `40 dp`, то есть выше общего guide-threshold `36 dp`;
- start circle и end-arrow поэтому показываются штатно через shared renderer;
- end-arrow использует текущий global `1.20×` visual scale;
- Gesture Check AUTO→MANUAL, feedback-reset, canvas и recognizer v2.1 не изменены.

Статус: **implementation candidate; build/install/device review pending**.

## Expanded surface architecture + canonical actions — 2026-10-03

В проект внесены новые канонические KnockUI assets:

- `design/knockui/icons/graffiti_reference.svg` — действие `Graffiti Reference`;
- `design/knockui/icons/app_search.svg` — действие `Клавиатура / App Search`.

Предоставленные SVG были в UTF-16; для хранения в Git нормализована только кодировка до UTF-8. Геометрия, viewBox, paths и цвет `#FEFEFE` сохранены.

Утверждена архитектура `expanded surface above KnockUI`:

- используется одно `WindowManager` overlay-window, без второго overlay и без отдельной Activity;
- состояния окна: `COMPACT | EXPANDED`;
- `EXPANDED` делится на `expandedRect` сверху и сохранённый `knockUiRect` снизу;
- expanded state: `NONE | GRAFFITI_REFERENCE | APP_SEARCH`;
- expanded surface не является remembered panel; запоминаются только `Ярлыки / Рисование`;
- Slot/Draw/Destination state при открытии expanded surface сохраняется;
- `GRAFFITI_REFERENCE` остаётся non-focusable;
- `APP_SEARCH` временно делает то же окно focusable для standard Android IME и восстанавливает flags после закрытия;
- same-action tap закрывает surface; другая expanded-action переключает её напрямую; `Ярлыки / Рисование` закрывают expanded surface; `Close` закрывает весь KnockUI;
- expanded area owns touch и не передаёт его underlying foreground app;
- вход в Docked 4Tap начинает с `ExpandedSurface.NONE`;
- из уже Docked KnockUI expanded surface можно открыть поверх верхней области, не закрывая и не сбрасывая underlying 4Tap Activity; после закрытия возвращается тот же экран.

Статус: **architecture + canonical assets approved; Android implementation pending**.

## Expanded surface infrastructure implemented — 2026-10-03

Single-window architecture `expanded surface above KnockUI` реализована в Android-коде как инфраструктурный candidate, без подключения feature content/actions.

`DrawingOverlay` теперь поддерживает:

- `WindowMode.COMPACT | EXPANDED`;
- `ExpandedSurface.NONE | GRAFFITI_REFERENCE | APP_SEARCH`;
- сохранённые compact width / KnockUI height / bottom margin;
- `EXPANDED` через то же `WindowManager` overlay-window с `MATCH_PARENT × MATCH_PARENT`;
- внутренний layout `expandedRect` сверху + сохранённый нижний KnockUI;
- floating-expanded: прежняя компактная ширина/центрирование KnockUI;
- docked-expanded: full-width KnockUI;
- control strip / Destination / work-area / hit-regions относительно нижнего KnockUI rect;
- `APP_SEARCH` focusability toggle через временное снятие `FLAG_NOT_FOCUSABLE`;
- возврат к `NONE/GRAFFITI_REFERENCE` восстанавливает non-focusable contract;
- Docked inset всегда использует compact KnockUI height, а не высоту полноэкранного expanded-window;
- верхний expandedRect уже имеет отдельную touch boundary.

Пока намеренно не подключены: новые control-strip actions, Android derivatives SVG, Graffiti Reference 6×6 content, EditText/IME/app list.

Статус: **infrastructure implementation candidate; build/install/device review pending**.

## Graffiti Reference expanded surface implemented — 2026-10-03

Подключены новые canonical actions KnockUI и реализована первая полноценная expanded surface.

Control strip:

`Logo | Ярлыки | Рисование | Graffiti Reference | Клавиатура | [Slot1 | Slot2 | Send в Draw] | flexible | Close`.

Android candidate:

- strip height `48 dp`;
- cell width = `min(48 dp, KnockUI width / 9)`;
- `Close` закреплён справа;
- добавлены `ic_knockui_graffiti_reference.xml` и `ic_knockui_app_search.xml` с сохранением SVG fill rules.

`Graffiti Reference`:

- собственная action-кнопка открывает/закрывает `GRAFFITI_REFERENCE`;
- expandedRect содержит read-only `6 × 6` всех `A–Z + 0–9`;
- renderer: `GraffitiReferenceGridRenderer`;
- teal cells, `1 dp` separators, `4 dp` glyph inset;
- общая высота от X-reference, `8%` width reserve для широких W/M;
- общий `GraffitiRenderer` сохраняет SVG-aware stroke, `>=36 dp` guides и end-arrow `1.20×`;
- Pair Selection semantics отсутствуют.

`Клавиатура / App Search` action также подключена к `APP_SEARCH`, но верхняя область пока намеренно пустая: поиск, `EditText`, standard IME и app list относятся к следующему подпункту.

Статус: **implementation candidate; build/install/physical expanded-geometry review pending**.

## Expanded transition + Draw input group refinement — 2026-10-03

Physical review подтвердил работоспособность `Graffiti Reference`, но выявил однокадровый flash старой compact-строки при `COMPACT → EXPANDED`.

Android candidate исправлен:

- target width/height нового window-state вычисляются заранее;
- View временно подавляет drawing и touch, пока фактический размер окна не совпал с target;
- `onSizeChanged` снимает gate и сразу показывает конечную композицию;
- panel/Slot/Draw state не сбрасываются.

Control strip также перестроен:

`Logo | Ярлыки | Graffiti Reference | Клавиатура | Рисование | Slot1 | Slot2 | Send | Close`.

`Рисование + Slot1 + Slot2` теперь образуют единый contiguous Draw input group на общем `inactiveTeal` фоне; selected Draw/Slot state использует `pressedTeal`. `Send` остаётся соседним действием выполнения, но визуально не входит в input group.

Статус: **implementation candidate; build/install/device re-review pending**.

## Persistent fullscreen expanded transition correction — 2026-10-03

Повторный physical review подтвердил работоспособность `Graffiti Reference`, но показал, что первый anti-flash `resize gate` не устранил однокадровый compositor-artifact.

Android architecture скорректирована:

- одно overlay-window теперь постоянно `MATCH_PARENT × MATCH_PARENT` и прозрачно;
- `COMPACT / EXPANDED` больше не resize/reposition WindowManager surface;
- `COMPACT`: рисуется только нижний KnockUI, touchable-region ограничена его rect, прозрачная область выше pass-through;
- `EXPANDED`: в том же окне добавляется `expandedRect` и расширяется touchable-region;
- `NONE ↔ GRAFFITI_REFERENCE` не вызывает `updateViewLayout()`;
- canvas очищается до transparent перед каждым draw;
- изменение focusability через `updateViewLayout()` остаётся только для будущего `APP_SEARCH`, где оно функционально необходимо.

Одновременно усилен Draw input group:

`Рисование + Slot1 + Slot2` — общий `inactiveTeal` rounded-module с inset `1.5/2 dp`, radius `6 dp`, внешним контуром `2 dp #171717` и внутренними separators `1 dp`. Selected-state остаётся `pressedTeal`; `Send` расположен отдельно справа.

Статус: **implementation candidate; build/install/device re-review pending**.

## Expanded transition compile fix — 2026-10-03

После physical review первого anti-flicker pass пользователь сообщил, что при вызове `Graffiti Reference` всё ещё кратко видны верхняя панель и нижний фрагмент Reference перед стабилизацией.

Попытка перейти на persistent full-screen overlay с custom touchable-region использовала `ViewTreeObserver.OnComputeInternalInsetsListener`. Реальный build пользователя завершился `compileDebugKotlin FAILED`: этот internal Android API недоступен обычному SDK. Подход удалён.

Текущий Android candidate использует только публичный WindowManager API:

- `COMPACT` снова имеет реальный compact window;
- перед resize старый surface скрывается через `LayoutParams.alpha = 0`;
- на следующем `postOnAnimation` применяются width/height/y, flags и expanded-state;
- ещё через один `postOnAnimation` готовая композиция возвращается в `alpha = 1`;
- `compositionGeneration` отменяет устаревшие transition callbacks;
- View и Draw/Slot/panel state сохраняются.

Draw input group усилен: `Рисование + Slot1 + Slot2` оформлены как отдельный скруглённый `inactiveTeal` модуль с `2 dp` тёмным контуром и `1 dp` внутренними разделителями; `Send` остаётся снаружи справа.

Статус: **compile fix committed; новый build/device review pending**.

## Expanded transition physical PASS + App Search candidate — 2026-10-03

Повторный пользовательский запуск:

`gradlew testDebugUnitTest assembleDebug installDebug`

завершился **PASS**.

Physical review подтвердил:

- flicker при открытии `Graffiti Reference` исчез;
- flicker при закрытии исчез;
- краткая верхняя панель больше не появляется;
- нижний фрагмент `Graffiti Reference` больше не появляется;
- floating/Docked KnockUI и закрытие expanded surface работают;
- `Рисование + Slot1 + Slot2` читается лучше как единый input group; дальнейшая визуальная шлифовка группы отложена и не блокирует следующий этап.

Public alpha-gated WindowManager resize фиксируется как текущий подтверждённый baseline expanded transition. Persistent full-screen/touchable-region вариант на internal Android API остаётся отклонённым.

Следующий утверждённый подпункт — `App Search / Клавиатура` — реализован в Android candidate:

- используется существующее состояние `ExpandedSurface.APP_SEARCH`;
- верхняя область получила обычный Android `EditText` и standard IME;
- launchable applications получаются через `PackageManager` + `MAIN / CATEGORY_LAUNCHER`, без расширения package visibility;
- поиск выполняется case-insensitive по display label с live-filter;
- строки показывают app icon + display label;
- запуск использует общий safe app-launch path 4Tap на базе `getLaunchIntentForPackage`;
- перед успешным внешним APP-launch KnockUI закрывается по общему контракту;
- поиск не создаёт и не изменяет 4Tap-команду;
- history, fuzzy ranking и recommendations в первый pass не добавлялись;
- recognizer v2.1, Gesture Check и Draw AUTO/MANUAL не изменялись.

Статус: **implementation candidate; build/install и physical App Search review pending**.



## App Search exit refinement — 2026-10-03

Базовый Android `Клавиатура / APP_SEARCH` прошёл `testDebugUnitTest assembleDebug installDebug` и первичную physical review: вход в поиск и standard Android IME работают. На устройстве выявлен UX-пробел выхода при открытой IME, поскольку нижняя панель KnockUI перекрыта клавиатурой.

Утверждён текущий exit-contract:

- видимая кнопка `×` справа в верхней search-row закрывает только `APP_SEARCH`, скрывает IME и возвращает обычный KnockUI;
- horizontal swipe влево/вправо по поверхности поиска, начатый вне поля ввода, выполняет то же действие;
- vertical scroll списка приложений остаётся обычным;
- Android candidate использует порог `max(72 dp, 25% ширины APP_SEARCH)`;
- повторный build/install/device exit-check pending.


## App Search control-strip composition — 2026-10-03

После physical PASS базового `APP_SEARCH` и выхода `× + horizontal swipe` утверждён следующий UI-layout:

`standard Android IME → canonical 48 dp control strip KnockUI → App Search`.

В режиме поиска остальное тело KnockUI не показывается. Строка иконок располагается непосредственно над IME, сохраняет обычную геометрию и действия; App Search занимает всё пространство выше неё. Android candidate реализован; build/install/device layout-check pending.


## App Search visible-IME boundary correction — 2026-10-03

Фактический build предыдущего layout-candidate: **BUILD SUCCESSFUL**. Physical review показал, что `APP_SEARCH` и standard Android IME работают, KnockUI при появлении IME **не закрывается**, но 48-dp control strip полностью скрыта за клавиатурой, из-за чего App Search визуально стыкуется непосредственно с IME.

Текущий correction candidate для Android 9:

- не считает resized `TYPE_ACCESSIBILITY_OVERLAY.height` надёжной верхней границей IME;
- использует публичный `View.getWindowVisibleDisplayFrame(Rect)` + `OnGlobalLayoutListener`;
- переводит нижнюю границу visible frame в локальные координаты overlay;
- ставит canonical 48-dp control strip непосредственно над этой границей;
- App Search заканчивается на верхней границе strip;
- build/install/device layout-check pending.


## App Search final IME composition — real-device PASS — 2026-10-03

Повторный `testDebugUnitTest assembleDebug installDebug` — **BUILD SUCCESSFUL**. Physical review подтвердил финальный `APP_SEARCH`:

- standard Android IME работает;
- KnockUI не закрывается при появлении IME;
- canonical 48-dp control strip полностью видна непосредственно над IME;
- App Search занимает область выше control strip;
- correction через public `View.getWindowVisibleDisplayFrame()` работает на основном Android 9 test device;
- прежняя тонкая обрезанная полоса KnockUI устранена.

`App Search / Клавиатура` фиксируется как real-device baseline. Следующий активный UI-блок — `Quick Shortcuts / Ярлыки`: сначала data/layout canon, затем реализация.


## Quick Shortcuts canon approved — 2026-10-03

Утверждён следующий блок KnockUI — `Quick Shortcuts / Ярлыки`:

- единый ordered list; страницы создаются/исчезают автоматически как горизонтальная пагинация;
- геометрия сетки определяется фактической рабочей областью KnockUI;
- виртуальный последний элемент `+` добавляет новый ярлык;
- tap = выполнить; long press = редактировать конкретный ярлык; long press + drag = переставить; постоянного глобального edit-mode нет;
- Usage Access — optional: при отказе starter set строится из системно определяемых доступных назначений; при согласии формируются **6–7 Quick Shortcuts** и **10 первичных Назначений**;
- персонализированный отбор использует востребованность и концепцию `4Tap Opportunity` — приложение нужно достаточно часто, но привычный вызов демонстрирует повышенное трение;
- физическое положение иконки в launcher не считается доступным системным сигналом;
- точная формула Opportunity пока не утверждена;
- автоматические XY для первичных Назначений строятся мнемонически из display name; кириллические названия транслитерируются из отображаемого пользователю имени;
- существующие пользовательские XY автоматикой не перезаписываются.

Следующий decision: exact `4Tap Opportunity` scoring, затем первый implementation candidate.


## Quick Shortcuts starter composition approved — 2026-10-03

Утверждена композиция персонализированного starter set при добровольном Usage Access:

- `Quick Shortcuts`: **7 = 3 самых востребованных + 4 лучших по 4Tap Opportunity**;
- стартовая раскладка — **4 ярлыка в ряд**; виртуальный `+` остаётся последним элементом ordered list и при 7 ярлыках занимает восьмую ячейку второго ряда;
- `Назначения`: **10 = 4 самых востребованных + 6 лучших по 4Tap Opportunity**;
- автоматический starter set не создаёт несколько назначений на одно destination/application;
- пользователь вручную может создать несколько разных XY для одного destination, например `KA` и `CA` для одного Калькулятора;
- мнемонические XY для кириллических display names строятся через транслитерацию отображаемого пользователю имени.

Следующий этап — первый implementation candidate Quick Shortcuts по утверждённому канону.


## Quick Shortcuts first Android candidate — 2026-10-03

Первый Android candidate `Quick Shortcuts / Ярлыки` реализован:

- 4 ярлыка в ряд, стандартно 2 ряда;
- единый ordered list, virtual final `+`, horizontal pagination;
- tap = launch;
- long press = локальные `Заменить / Удалить`;
- long press + drag = reorder, включая переход к соседней странице через край;
- add/replace используют существующий App Search в selection-mode;
- порядок хранится отдельно и после ручной правки считается user-owned;
- optional `PACKAGE_USAGE_STATS` объявлен без нового обязательного onboarding;
- без Usage Access — fallback системно определяемых назначений;
- при уже выданном Usage Access — personalized starter `7 = 3 Need + 4 Opportunity`;
- current Opportunity candidate использует повторяемую задержку `Home → app` вместе с частотой/днями использования.

Автоматический seeding `10 = 4 Need + 6 Opportunity` мнемонических XY пока намеренно не включён: существующий подтверждённый `SC → Settings` prototype baseline мигрируется отдельным sub-gate после physical PASS Quick Shortcuts.

Статус: **build/install/device review pending**.


## Personalized Assignments migration candidate — 2026-10-03

Добавлен следующий Android sub-gate:

- старый prototype CommandRegistry очищается одноразовой migration v2;
- без Usage Access реестр ждёт персонализированное заполнение;
- при Usage Access и до первой ручной правки создаётся до **10** APP-назначений по схеме `4 Need + 6 Opportunity` без destination-дублей;
- для каждого приложения генерируется свободная mnemonic XY из display name;
- кириллическое имя транслитерируется перед генерацией (`Калькулятор → KA` как первый candidate);
- занятые пары пропускаются;
- после первого ручного изменения registry становится user-owned и больше автоматически не пересеивается.

Статус: **implementation candidate; build/device validation pending**.


## Quick Shortcuts first real-device PASS — 2026-10-03

Первый Android gate `Quick Shortcuts / Ярлыки` подтверждён на реальном устройстве: сборка/установка прошли, панель открывается и работает. На устройстве без Usage Access fallback-набор дал 4 уникальных launchable shortcuts; personalized `7 = 3 Need + 4 Opportunity` остаётся проверить после выдачи Usage Access.

Следующий sub-gate — одноразовая очистка старого prototype CommandRegistry и personalized seed до 10 мнемонических Назначений по схеме `4 Need + 6 Opportunity`.


## Assignment fallback without Usage Access — 2026-10-03

Отсутствие Usage Access больше не оставляет `Назначения` пустыми. При первом автоматическом состоянии формируется fallback-набор из реально доступных системно определяемых destinations с mnemonic XY. Если позже пользователь добровольно выдаёт Usage Access и ещё не редактировал реестр вручную, automatic fallback может один раз замениться personalized seed `4 Need + 6 Opportunity`. После ручной правки source = `user`, автоматическая замена запрещена.

Текущий пустой migration-v2 registry на уже установленном устройстве будет заполнен fallback-набором при первом чтении после обновления; новая ручная очистка не требуется.


## KnockUI drawing activation refinements — 2026-10-03

По real-device UI review реализованы два refinement:

- `Logo/About Hub → Открыть 4Tap` перед Docked 4Tap переводит нижний KnockUI в `Рисование`;
- `Graffiti Reference / ABCD` перед expanded reference также переводит KnockUI в `Рисование`.

Quick Shortcuts pages остаются demand-driven: пустые соседние страницы не создаются. При standard capacity 8 cells `7 shortcuts + +` помещаются на одной странице; следующая появляется с восьмым shortcut.

Usage Access остаётся special app access и выдаётся пользователем через системную страницу Settings; 4Tap может только направить пользователя туда.


## Quick Shortcuts slot-drag + Draw assign candidate — 2026-10-03

После real-device review dense-list drag заменён slot-based candidate:

- каждый shortcut хранит явный slot;
- пустые ячейки допустимы;
- drop на occupied slot = swap;
- drop на empty slot сохраняет новое место;
- edge-drag вправо может создать соседнюю страницу;
- единственный `+` располагается после последнего занятого slot;
- старые записи без slot мигрируют как `0,1,2…`.

В Draw добавлен action для свободной знакопары: `НЕ НАЗНАЧЕНО | НАЗНАЧИТЬ`. `НАЗНАЧИТЬ` открывает существующий Destination UI с уже нарисованной XY; повторный выбор пары/Gesture Check не выполняются; выбранные APP / SYSTEM / WEB сохраняются непосредственно в CommandRegistry.

Статус: **implementation candidate; build/install/device validation pending**.


## Android field-trial checkpoint — 2026-10-04

На основном `LGM-V300L / Android 9` подтверждено текущее промежуточное состояние:

- без Usage Access доступны 4 fallback Quick Shortcuts и 4 fallback Assignments;
- personalized Usage Access starter set ещё не прошёл physical validation;
- после одной debug-переустановки Accessibility визуально оставался включён, но trigger потребовал OFF→ON re-arm; после перевключения 4-tap снова работал;
- slot-based Quick Shortcuts drag и Draw action `НЕ НАЗНАЧЕНО | НАЗНАЧИТЬ` достигли положительного промежуточного device-state, но ещё требуют polish;
- WEB destination остаётся известным UX-gap перед широкой полевой проверкой.

## WEB destination v0.2 checkpoint — 2026-10-04

Утверждён и внесён Android implementation candidate:

- ручной ввод WEB использует standard Android IME;
- рядом с URL-полем есть явное действие `ВСТАВИТЬ`; системный long-press/paste сохраняется;
- применяется единый `trim → normalize → validate` pipeline;
- при отсутствии схемы добавляется `https://`, если адрес проходит WEB-валидацию;
- полный URL сохраняется как WEB destination, короткий host используется в Command/KnockUI;
- добавлен штатный Android вход `браузер → Поделиться → 4Tap`;
- Share только предварительно заполняет существующий `НАЗНАЧИТЬ / WEB` и не создаёт команду автоматически;
- далее используется общий destination-first flow `WEB → ЗНАКОПАРА → Проверка жеста → КОМАНДА`;
- новых runtime permissions нет;
- recognizer v2.1, Gesture Check и Draw AUTO/MANUAL не затронуты.

Статус: **implementation candidate; build/install/device review pending**. Новый physical PASS не объявлен.

## Service Menu + WEB validation + Docked IME candidate — 2026-10-04

Android candidate синхронизирован с новым UX-блоком:

- 4Tap Logo ведёт прямо в Commands; отдельный Logo/About Hub удалён;
- Hamburger Menu получил текстовые разделы Активация / Персонализация / Тестирование / О 4Tap;
- ScreenCart = SC и Поддержать 4Tap = 4T являются зарезервированными системными знакопарами;
- root Back в Commands неактивен, пока нет внутреннего уровня возврата;
- SYSTEM расширен до Settings / Wi-Fi / Bluetooth / Display / Sound;
- WEB использует live syntactic validation и disabled action до корректного адреса;
- Docked 4Tap получил IME priority: KnockUI временно скрывается на время Activity IME и восстанавливается с сохранённым состоянием.

Статус: implementation candidate; build/install/device review pending. Новый physical PASS не объявлен.

## Full 4Tap navigation refinement — 2026-10-05

Синхронизирован новый Android candidate:

- 4Tap Logo работает как toggle Floating ↔ Docked Commands;
- Full 4Tap surfaces получили отдельный Close ×;
- Back означает только внутренний возврат; root Commands Back неактивен;
- XY-search удалён из КОМБИНАЦИИ и standalone ЗНАКОПАРА;
- Android Back / Home / Recents остаются системными;
- Service Menu получил vertical scroll;
- ScreenCart / Support 4Tap получили раздельные визуальные блоки; SC — на контрастной тёмной подложке.

Статус: implementation candidate; build/install/device review pending.

